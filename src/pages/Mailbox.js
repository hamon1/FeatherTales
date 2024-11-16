import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useNavigation } from '../utils/navigate'

import { api, getFriendRequest, friendRequest, acceptFriendRequest, searchFriend, rejectFriendRequest, deleteFriend } from '../api';

import LoadingPage from './LoadingPage';

import { friendsListBatch } from '../utils/friendUtils'

const Mailbox = () => {
    const { user } = useContext(UserContext);
    const [friendRequests, setFriendRequests] = useState([]);

    const { goToLogin } = useNavigation();

    const [friends, setFriends] = useState([]);
    const [friendsData, setFriendsData] = useState([]);
    const [ currentPage, setCurrentPage] = useState(0);
    const [ totalPages, setTotalPages] = useState(0);

    const [ isLoading, setIsLoading ] = useState(false);
    const [ isReload, setIsReload ] = useState(false);

    const [ query, setQuery ] = useState();
    const [searchResult, setSearchResult] = useState([]);

    const { token } = sessionStorage.getItem('token');

    const handleGetRequests = async() => {
        setIsReload(true);
        try {
            const res = await getFriendRequest(token, user.userid);
            console.log('Friend request', res);
            setFriendRequests(res);


            // setFriends(friendlist);

        } catch (error) {
            console.log('error get request:', error.response.data.msg);
        }
        setIsReload(false);
    }

    const handleSendRequest = async(userid) => {
        console.log('친구 요청!', userid);
        try {
            const res = await friendRequest(token, { toUserId: userid })
            console.log('친구 요청', res);
        } catch (error) {
            console.log('error send request:', error.response.data.msg);
        }
    }

    const requestList = () => {
        if (friendRequests.length === 0) {
            return <div>요청이 없습니다.</div>
        } else {
            return friendRequests.map((data, index) => (
                <div key={index}>
                    {data.fromUserNickname}
                    <button onClick={() => acceptFriendRequest(token, data._id).then(fetchFriend())}>수락</button>
                    <button onClick={() => rejectFriendRequest(token, data._id)}>거절</button>
                </div>
            ))
        }
    }
    const friendsList = () => {
        console.log(friendsData);
        if (!friendsData || friendsData.length === 0) {
            return <div>친구가 없어요.</div>
        } else {
            return friendsData.map((data, index) => (
                <div key={index}>
                    {data.username}
                    <button onClick={() => deleteFriend(token, data.friendId).then(fetchFriend())}>삭제</button>
                </div>
            ))
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            // setCurrentPage(currentPage + 1);
            // fetchFriend(currentPage);
            setCurrentPage(prevPage => {
                const newPage = prevPage + 1;
                fetchFriend(newPage);
                return newPage;
            });
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            // setCurrentPage(currentPage - 1);
            // fetchFriend(currentPage );
            setCurrentPage(prevPage => {
                const newPage = prevPage - 1;
                fetchFriend(newPage);
                return newPage;
            });
        }
    };


    const fetchFriend = async (page) => {
        console.log('friend?', friends);
        const friendlist = await friendsListBatch({friendsList: friends, page: page, token: token});
        console.log('Friend request!!', friendlist);
        setFriendsData(friendlist);

        setTotalPages(Math.ceil(friendlist.length/10));
    }

    const handleSearch = async () => {
        console.log('searchFriend', query);

        if (!query) {
            alert('검색어를 입력하세요.');
            return;
        } else {
            const [name_query, id_query ] = query.split('#');
            console.log('검색어: ', name_query, id_query);

            // if (id_query && id_query.length === 6) {
            //     await searchFriend(token, query);
            //     return;
            // }

            if (id_query && id_query.length !== 6) {
                alert('ID는 6자리로 입력하세요.');
                return;
            } else if (name_query && name_query.length < 2) {
                alert('닉네임은 3글자 이상 입력하세요.');
                return;
            }   

            try {
                const result = await searchFriend(token, query);
    
                console.log('검색 결과: ', result);
                setSearchResult(result);

                console.log('result: ', searchResult);
            } catch (error) {
                console.log('검색 중 에러: ', error.response.data.msg);
            }
        }

    }

    const searchedFriend = () => {
        if (searchResult.length > 0) {
            console.log("검색 결과: ", searchResult)
            return searchResult.map(item => (
                    <>
                        <div key={item.id}>
                            {item.username}
                            <button onClick={() => handleSendRequest(item._id)}>친구 추가</button>                        </div>
                    </>
                )
            );
        }
        else {
            return <div>검색 결과가 없습니다.</div>
        }
    }

    useEffect(() => {
        if (user) {
            setIsLoading(false);
            console.log(user.userid);
            console.log(user);
            setFriends(user.friends);

            fetchFriend(currentPage)

        } else {
            setIsLoading(true);
        }
    }, [user]);

    useEffect(() => {
        // if (user) {
        //     setIsLoading(false);

            fetchFriend(currentPage)
        // } else {
        //     setIsLoading(true);
        // }
    }, [friends, currentPage]);

    return (
        <>
        {isLoading ? (
            <LoadingPage/>
        ): 
            <div class="modal-content mailbox" onClick={(e) => e.stopPropagation()}>
                <h1>mailbox Page</h1>
                <div class="search-friend">
                    <input 
                        type="text" 
                        placeholder="친구 찾기" 
                        value={query} 
                        onChange={e => setQuery(e.target.value)}
                        />
                    <button onClick={() => handleSearch()}>검색</button>
                    {searchedFriend()}
                </div>
                <button onClick={handleSendRequest}>친구 요청</button>
                <button onClick={handleGetRequests}>친구 요청 새로고침</button>
                {!isReload ? (
                    requestList()
                ):
                <div>새로 고침</div>
                }
                <div>
                    <p>친구 목록</p>
                    <div>
                        <button onClick={handlePreviousPage} disabled={currentPage === 0}>
                            이전 페이지
                        </button>
                        <span>
                            페이지 {currentPage + 1} / {totalPages + 1}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                        >
                            다음 페이지
                        </button>
                    </div>
                    {friendsList()}
                </div>
            </div>

}
        </>
    )
}

export default Mailbox;