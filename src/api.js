import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:4000/',
    // baseURL: 'https://feathertales-backend.onrender.com'
});

api.interceptors.request.use(config => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
})

export const registerUser = async (userData) => {
    // try {
        const response = await api.post(`/auth/register`, userData);
        return response.data;
    // } catch (error) {
    //     throw error.response.data;
    // }
};

export const loginUser = async (credentials) => {
    // try {
        const response = await api.post(`/auth/login`, credentials);
        sessionStorage.setItem('token', response.data.token);
        return response.data;
    // } catch (error) {
    //     throw error.response.data;
    //     // return error.response.data.msg;
    // }
};

export const logoutUser = () => {
    sessionStorage.removeItem('token');
}

export const getUserData = async (token) => {
    console.log('getUserData', token);
    try {
    const response = await api.get(`/auth/user`, {
        headers: { Authorization: `Bearer ${token}`}
    });
    return response.data;
    } catch (error) {
        throw error.response.data;
        // return error.response.data.msg;
    }
};

export const updateUserData = async (token, updatedUser) => {
    const response = await api.put('/auth/update-avatar', updatedUser, {
        headers: { Authorization: `Bearer ${token}`}
    });
    return response.data;
}

export const getCategories = async (token) => {
    const response = await api.get(`/auth/getCategories`, {
        headers: { Authorization: `Bearer ${token}`}
    });
    return response.data;
}

export const addCategory = async (token, category) => {
    console.log(`Adding category`, category);
    const response = await api.put(`/auth/addCategory`, {category}, {
        headers: { Authorization: `Bearer ${token}`}
    });
    return response.data;
}

export const createDoc = async (token, docData) => {
    console.log(token, docData);
    const response = await api.post('/documents/newdoc', docData, {
        headers: { Authorization: `Bearer ${token}`}
    });
    return response.data;
}

export const updateDoc = async (token, docid, docData) => {
    const response = await api.put(`/documents/updateDoc?docid=${docid}`, docData, {
        headers: { Authorization: `Bearer ${token}`}
    });
    return response.data;
}

export const deleteDoc = async (token, docId) => {
    const response = await api.delete(`/documents/deleteDoc/${docId}`, {
        headers: { Authorization: `Bearer ${token}`}
    });
    return response.data;
}

export const searchDocs = async (query) => {

}

export const getDocs = async (token, userid) => {
    const response = await api.get(`/documents/getDocument`, {
        headers: { Authorization: `Bearer ${token}`}
    });
    return response.data;
}

export const getDocsbyDocId = async (token, docId) => {
    const response = await api.get(`/documents/getDocumentbyid/${docId}`, {
        headers: { Authorization: `Bearer ${token}`}
    });
    return response.data;
}

export const getFriendRequest = async (token, toUserId) => {
    const response = await api.get(`/friends/getFriend-requests?toUserId=${toUserId}`, {
        headers: { Authorization: `Bearer ${token}`}
    });
    return response.data;
}

export const friendRequest = async (token, requestData) => {
    const response = await api.post(`/friends/friend-request`, requestData, {
        headers: { Authorization: `Bearer ${token}`}
    });
    return response.data;
}

export const acceptFriendRequest = async (token, requestId) => {
    const response = await api.put(`/friends/accept?requestId=${requestId}`, {
        headers: { Authorization: `Bearer ${token}`}
    });
    return response.data;
}

export const rejectFriendRequest = async (token, requestId) => {
    const response = await api.put(`/friends/reject?requestId=${requestId}`, {
        headers: { Authorization: `Bearer ${token}`}
    });
    return response.data;
}

export const searchFriend = async (token, query) => {
    // console.log('searching', query);
    const encodeQuery = encodeURIComponent(query);
    const response = await api.get(`/friends/searchFriend?query=${encodeQuery}`, {
        headers: { Authorization: `Bearer ${token}`}
    });
    return response.data;
}

export const getFriendsData = async (token, batch) => {
    const response = await api.post(`/friends/getFriendsData`,  batch , {
        headers: { Authorization: `Bearer ${token}`}
    });
    return response.data;
}

export const deleteFriend = async (token, friendId) => {
    console.log('delete friend', friendId);
    const response = await api.delete(`/friends/${friendId}`, {
        headers: { Authorization: `Bearer ${token}`}
    });
    return response.data;
}

export const getRoomData = async (token) => {
    console.log('getRoomData');
    const response = await api.get(`/room/getRoomData`, {
        headers: { Authorization: `Bearer ${token}`}
    });
    return response.data;
}

export const addDiaryEntry = async (token, daryData) => {
    console.log('addDiaryEntry', daryData);
    const response = await api.post(`/calendar/addDiaryEntry`, daryData, {
        headers: { Authorization: `Bearer ${token}`}
    });
    return response.data;
}