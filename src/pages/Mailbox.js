import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';

import { api, getFriendRequest, friendRequest, acceptFriendRequest } from '../api';

import LoadingPage from './LoadingPage';

import { friendsListBatch } from '../utils/friendUtils'

const Mailbox = () => {
    const { user } = useContext(UserContext);
    const [friendRequests, setFriendRequests] = useState([]);

    const [friends, setFriends] = useState([]);
    const [friendsData, setFriendsData] = useState([]);
    const [ currentPage, setCurrentPage] = useState(0);
    const [ totalPages, setTotalPages] = useState(0);


    const [ isLoading, setIsLoading ] = useState(false);
    const [ isReload, setIsReload ] = useState(false);

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

    const handleSendRequest = async() => {
        console.log('친구 요청!');
        try {
            const res = friendRequest(token, { toUserId: 'f109d85b-504f-4727-84bb-c8e8cd52f384', fromUserId: user.userid, fromUserNickname: user.username})
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
                    <button onClick={() => acceptFriendRequest(token, data._id)}>수락</button>
                    <button onClick={() => console.log('거절')}>거절</button>
                </div>
            ))
        }
    }
    const friendsList = () => {

        if (!friendsData || friendsData.length === 0) {
            return <div>친구가 없어요.</div>
        } else {
            return friendsData.map((data, index) => (
                <div key={index}>
                    {data.username}
                    <button onClick={() => console.log('거절')}>거절</button>
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
        if (user) {
            setIsLoading(false);

            fetchFriend(currentPage)
        } else {
            setIsLoading(true);
        }
    }, [friends]);

    return (
        <>
        {isLoading ? (
            <LoadingPage/>
        ): 
            <div class="mailbox-content" onClick={(e) => e.stopPropagation()}>
                <h1>mailbox Page</h1>
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