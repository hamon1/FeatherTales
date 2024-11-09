import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:4000/',
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
    const response = await api.get(`/documents/getDocument?userid=${userid}`, {
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