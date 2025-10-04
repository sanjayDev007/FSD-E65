const BASE_URL = 'http://localhost:3000/api';
import axios from "axios";

const login = async (token) => {
    try {
        const { data, status } = await axios.post(`${BASE_URL}/customers/login`, { access_token: token });
        if (status === 200 && data.token) {
            localStorage.setItem('token', data.token);
        }
        return {success: status === 200, ...data};
    } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message };
    }
}
const register = async (token) => {
    try {
        const { data, status } = await axios.post(`${BASE_URL}/customers/register`, { access_token: token });
        if (status === 200 && data.token) {
            localStorage.setItem('token', data.token);
        }
        return {success: status === 200, ...data};
    } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message };
    }
}

const googleLogin = async (token) => {
    try {
        const { data, status } = await axios.post(`${BASE_URL}/customers/google-login`, { access_token: token });
        if (status === 200 && data?.token) {
            localStorage.setItem('token', data.token);
        }
        return {success: status === 200, ...data};
    } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message };
    }
}

const protectedRoute = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await axios.get(`${BASE_URL}/customers/protected`, {
            headers: {
                'x-access-token': token
            }
        });
        return { success: true, ...response.data };
    } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message };
    }
}

const getProducts = async (query) => {
    try {
        const response = await axios.get(`${BASE_URL}/products`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            },
            params: query
        });
        return { success: true, ...response.data };
    } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message };
    }
}

export {
    login,
    googleLogin,
    register,
    protectedRoute,
    getProducts
}