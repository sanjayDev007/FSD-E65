import axios from "axios";
import { data } from "react-router-dom";

const BASE_URL = 'http://localhost:3000/api';

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

const getAddresses = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/customers/address`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        return { success: true, data:response.data };
    } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message };
    }
}

const createAddress = async (address) => {
    try {
        const response = await axios.post(`${BASE_URL}/customers/address`, address, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        return { success: true, data: response.data };
    } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message };
    }
}

const updateAddress = async (id, address) => {
    try {
        const response = await axios.put(`${BASE_URL}/customers/address/${id}`, address, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        return { success: true, data: response.data };
    } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message };
    }
}

const deleteAddress = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/customers/address/${id}`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        return { success: true, data: response.data };
    } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message };
    }
}

const checkout = async (items) => {
    try {
        const response = await axios.post(`${BASE_URL}/customers/checkout`, { items }, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        return { success: true, ...response.data };
    } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message };
    }
}

const getOrders = async (query = {}) => {
    try {
        const response = await axios.get(`${BASE_URL}/customers/orders`, {
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
    getProducts,
    getAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    checkout,
    getOrders
}