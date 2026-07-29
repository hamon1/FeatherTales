import axios from 'axios';

// ─── axios 인스턴스 ────────────────────────────────────────────────────────────

export const api = axios.create({
    baseURL: 'http://localhost:4000/',
});

// 모든 요청에 sessionStorage 토큰을 Authorization 헤더로 자동 주입
api.interceptors.request.use(config => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// ─── 인증 (Auth) ───────────────────────────────────────────────────────────────

export const registerUser = async (userData) => {
    const response = await api.post(`/auth/register`, userData);
    return response.data;
};

export const loginUser = async (credentials) => {
    const response = await api.post(`/auth/login`, credentials);
    sessionStorage.setItem('token', response.data.token);
    return response.data;
};

export const logoutUser = () => {
    sessionStorage.removeItem('token');
};

export const getUserData = async (token) => {
    try {
        const response = await api.get(`/auth/user`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const updateUserData = async (token, updatedUser) => {
    const response = await api.put('/auth/update-avatar', updatedUser, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getCategories = async (token) => {
    const response = await api.get(`/auth/getCategories`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const addCategory = async (token, category) => {
    const response = await api.put(`/auth/addCategory`, { category }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const deleteCategory = async (token, categoryId) => {
    const response = await api.delete(`/auth/deleteCategory/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// ─── 문서 (Documents) ─────────────────────────────────────────────────────────

export const getDocsFromCategory = async (token, categoryType) => {
    const response = await api.get(`/documents/getDocsFromCategory/${categoryType}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const createDoc = async (token, docData) => {
    const response = await api.post('/documents/newdoc', docData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateDoc = async (token, docid, docData) => {
    const response = await api.put(`/documents/updateDoc?docid=${docid}`, docData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const deleteDoc = async (token, docId) => {
    const response = await api.delete(`/documents/deleteDoc/${docId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const searchDocs = async (query) => {
    // TODO: 검색 API 미구현
};

export const getDocs = async (token) => {
    const response = await api.get(`/documents/getDocument`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getDocsbyDocId = async (token, docId) => {
    const response = await api.get(`/documents/getDocumentbyid/${docId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// ─── 친구 (Friends) ───────────────────────────────────────────────────────────

export const getFriendRequest = async (token, toUserId) => {
    const response = await api.get(`/friends/getFriend-requests?toUserId=${toUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const friendRequest = async (token, requestData) => {
    const response = await api.post(`/friends/friend-request`, requestData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const acceptFriendRequest = async (token, requestId) => {
    const response = await api.put(`/friends/accept?requestId=${requestId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const rejectFriendRequest = async (token, requestId) => {
    const response = await api.put(`/friends/reject?requestId=${requestId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const searchFriend = async (token, query) => {
    const encodeQuery = encodeURIComponent(query);
    const response = await api.get(`/friends/searchFriend?query=${encodeQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getFriendsData = async (token, batch) => {
    const response = await api.post(`/friends/getFriendsData`, batch, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const deleteFriend = async (token, friendId) => {
    const response = await api.delete(`/friends/${friendId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// ─── 방 (Room) ────────────────────────────────────────────────────────────────

export const getRoomData = async (token) => {
    const response = await api.get(`/room/getRoomData`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// ─── 달력 (Calendar) ──────────────────────────────────────────────────────────

export const addDiaryEntry = async (token, diaryData) => {
    const response = await api.post(`/calendar/addDiaryEntry`, diaryData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
