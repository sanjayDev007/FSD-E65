import axios from 'axios'
import React from 'react'
import apiUrl from './apiUrl'

async function UseProtected() {
    if (!localStorage.getItem('token')) {
        return false
    }
    try {
        let response = await axios.get(apiUrl+ '/auth/me', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.status == 200) {
            return true;
        }
    } catch (error) {
        return false
    }
}

export default UseProtected;