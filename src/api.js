import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:4000/auth',
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
        const response = await api.post(`/register`, userData);
        return response.data;
    // } catch (error) {
    //     throw error.response.data;
    // }
};

export const loginUser = async (credentials) => {
    // try {
        const response = await api.post(`/login`, credentials);
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
    const response = await api.get(`/user`, {
        headers: { Authorization: `Bearer ${token}`}
    });
    return response.data;
    } catch (error) {
        throw error.response.data;
        // return error.response.data.msg;
    }
};