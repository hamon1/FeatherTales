import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';

import { api, getFriendRequest, friendRequest, acceptFriendRequest } from '../api';

import LoadingPage from './LoadingPage';

const Mailbox = () => {
    const { user } = useContext(UserContext);
    const [friendRequests, setFriendRequests] = useState([]);

    const [friends, setFriends] = useState([]);

    const [ isLoading, setIsLoading ] = useState(false);
    const [ isReload, setIsReload ] = useState(false);

    const { token } = sessionStorage.getItem('token');

    const handleGetRequests = async() => {
        setIsReload(true);
        try {
            const res = await getFriendRequest(token, user.userid);
            console.log('Friend request', res);
            setFriendRequests(res);
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
        if (friends.length === 0) {
            return <div>요청이 없습니다.</div>
        } else {
            return friends.map((data, index) => (
                <div key={index}>
                    {data.username}
                    <button onClick={() => console.log('거절')}>거절</button>
                </div>
            ))
        }
    }

    useEffect(() => {
        if (user) {
            setIsLoading(false);
            console.log(user.userid);
            console.log(user);
            setFriends(user.friends);

            // const res = getFriendRequest(token, user.userid);

            // setFriendRequests(res);
        } else {
            setIsLoading(true);
        }
    }, [user]);

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
                <p>친구 목록</p>
                {friendsList()}
            </div>

}
        </>
    )
}

export default Mailbox;