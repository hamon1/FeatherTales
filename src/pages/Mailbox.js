import React, { useState, useContext, useEffect } from 'react';

import {
    api,
    getFriendRequest,
    friendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    searchFriend,
    deleteFriend,
} from '../api';
import { UserContext } from '../contexts/UserContext';
import { useNavigation } from '../utils/navigate';
import { friendsListBatch } from '../utils/friendUtils';

import LoadingPage from './LoadingPage';

const Mailbox = () => {
    const { user } = useContext(UserContext);
    const { goToLogin } = useNavigation();
    const token = sessionStorage.getItem('token');

    // ─── State ────────────────────────────────────────────────────────────────
    const [isLoading, setIsLoading]     = useState(false);
    const [isReload, setIsReload]       = useState(false);

    const [friends, setFriends]         = useState([]);
    const [friendsData, setFriendsData] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages]   = useState(0);

    const [query, setQuery]             = useState();
    const [searchResult, setSearchResult] = useState([]);

    // ─── Effects ──────────────────────────────────────────────────────────────

    // 유저 데이터 로드 완료 시 친구 목록 초기화
    useEffect(() => {
        if (user) {
            setIsLoading(false);
            setFriends(user.friends);
            fetchFriend(currentPage);
        } else {
            setIsLoading(true);
        }
    }, [user]);

    // 친구 목록이 바뀌거나 페이지가 변경될 때 배치 조회
    useEffect(() => {
        fetchFriend(currentPage);
    }, [friends, currentPage]);

    // ─── Data Fetchers ────────────────────────────────────────────────────────

    const fetchFriend = async (page) => {
        const friendlist = await friendsListBatch({ friendsList: friends, page, token });
        setFriendsData(friendlist);
        setTotalPages(Math.ceil(friendlist.length / 10));
    };

    // ─── Handlers ─────────────────────────────────────────────────────────────

    const handleGetRequests = async () => {
        setIsReload(true);
        try {
            const res = await getFriendRequest(token, user.userid);
            setFriendRequests(res);
        } catch (error) {
            console.log('error get request:', error.response.data.msg);
        }
        setIsReload(false);
    };

    const handleSendRequest = async (userid) => {
        console.log('친구 요청!', userid);
        try {
            const res = await friendRequest(token, { toUserId: userid });
            console.log('친구 요청', res);
        } catch (error) {
            console.log('error send request:', error.response.data.msg);
        }
    };

    const handleSearch = async () => {
        if (!query) {
            alert('검색어를 입력하세요.');
            return;
        }

        // 검색어 형식: "닉네임#6자리ID" 또는 "닉네임"
        const [name_query, id_query] = query.split('#');

        if (id_query && id_query.length !== 6) {
            alert('ID는 6자리로 입력하세요.');
            return;
        }
        if (name_query && name_query.length < 2) {
            alert('닉네임은 3글자 이상 입력하세요.');
            return;
        }

        try {
            const result = await searchFriend(token, query);
            setSearchResult(result);
        } catch (error) {
            console.log('검색 중 에러: ', error.response.data.msg);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => {
                const newPage = prevPage + 1;
                fetchFriend(newPage);
                return newPage;
            });
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prevPage => {
                const newPage = prevPage - 1;
                fetchFriend(newPage);
                return newPage;
            });
        }
    };

    // ─── Render Helpers ───────────────────────────────────────────────────────

    const requestList = () => {
        if (friendRequests.length === 0) {
            return <div>요청이 없습니다.</div>;
        }
        return friendRequests.map((data, index) => (
            <div key={index}>
                {data.fromUserNickname}
                <button onClick={() => acceptFriendRequest(token, data._id).then(fetchFriend())}>수락</button>
                <button onClick={() => rejectFriendRequest(token, data._id)}>거절</button>
            </div>
        ));
    };

    const friendsList = () => {
        if (!friendsData || friendsData.length === 0) {
            return <div>친구가 없어요.</div>;
        }
        return friendsData.map((data, index) => (
            <div key={index}>
                {data.username}
                <button onClick={() => deleteFriend(token, data.friendId).then(fetchFriend())}>삭제</button>
            </div>
        ));
    };

    const searchedFriend = () => {
        if (searchResult.length > 0) {
            return searchResult.map(item => (
                <>
                    <div key={item.id}>
                        {item.username}
                        <button onClick={() => handleSendRequest(item._id)}>친구 추가</button>
                    </div>
                </>
            ));
        }
        return <div>검색 결과가 없습니다.</div>;
    };

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <>
            {isLoading ? (
                <LoadingPage />
            ) : (
                <div className="modal-content mailbox" onClick={(e) => e.stopPropagation()}>
                    <h1>mailbox Page</h1>

                    <div className="search-friend">
                        <input
                            type="text"
                            placeholder="친구 찾기"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                        <button onClick={() => handleSearch()}>검색</button>
                        {searchedFriend()}
                    </div>

                    <button onClick={handleGetRequests}>친구 요청 새로고침</button>
                    {!isReload ? requestList() : <div>새로 고침</div>}

                    <div>
                        <p>친구 목록</p>
                        <div>
                            <button onClick={handlePreviousPage} disabled={currentPage === 0}>
                                이전 페이지
                            </button>
                            <span>페이지 {currentPage + 1} / {totalPages + 1}</span>
                            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                                다음 페이지
                            </button>
                        </div>
                        {friendsList()}
                    </div>
                </div>
            )}
        </>
    );
};

export default Mailbox;
