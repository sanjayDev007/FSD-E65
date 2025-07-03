import React, { useEffect } from 'react'
import apiUrl from '../api/apiUrl'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UseProtected from '../api/UseProtected';

function Login() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const navigate = useNavigate();
    useEffect(()=>{
        async function checkProtected() {
            let isProtected = await UseProtected();
            if (isProtected) {
                navigate("/");
            }
        }
        checkProtected();
    },[]);
    async function handleSubmit(e) {
        e?.preventDefault();
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        try {
            let response = await axios.post(`${apiUrl}/auth/login`, { email, password, role: 'User' });
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                alert('Login successful');
                navigate('/');
            } else {
                alert('Login failed: ' + response.data.message);
            }
            
        } catch (error) {
            console.error('Error during registration:', error);
            alert(error.response?.data?.message || 'Login failed. Please try again later.');
        }
    }
  return (
    <>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6">
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={handleSubmit}
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </>
  )
}

export default Login