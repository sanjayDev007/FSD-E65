import React, { useState } from 'react'
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { googleLogin, login, register } from '../api';
import { useNavigate } from 'react-router-dom';
import app from '../firebase';

function Register() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [remember, setRemember] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (!email || !password) {
            setError('Please enter email and password.')
            return
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.')
            return
        }
        setLoading(true)
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            console.log(userCredential)
            const user = userCredential.user
            const token = user?.accessToken || '';
            // Optionally inform your backend / create user record
            const response = await register(token); // reuse login to create a session; replace if you have a register API
            console.log(response);
            if (response.success) {
            navigate('/dashboard');
            } else {
            // if backend didn't return success, still navigate or show message as needed
            setError(response.message || 'Registration successful, but backend login failed.')
            }
        } catch (err) {
            console.log(err);
            let errorMessage = 'Registration failed.';
            switch (err.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'This email is already in use.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address.';
                break;
            case 'auth/weak-password':
                errorMessage = 'Password is too weak.';
                break;
            case 'auth/operation-not-allowed':
                errorMessage = 'Email/password accounts are not enabled.';
                break;
            default:
                errorMessage = err.message || 'Registration failed.';
            }
            setError(errorMessage);
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setError('')
        setLoading(true)
        try {
            const result = await signInWithPopup(auth, provider)
            console.log(result);
            const user = result.user;
            const token = user?.accessToken || '';
            const response = await googleLogin(token); // backend handling for social login
            console.log(response);
            if (response.success) {
                navigate('/dashboard');
            } else {
                setError(response.message || 'Google registration/login failed.')
            }
        } catch (error) {
            console.log(error);
            setError(error.message || 'Google sign in failed.');
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                <div className="text-center mb-6">
                    <div className="mx-auto h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                        EM
                    </div>
                    <h2 className="mt-4 text-2xl font-semibold text-gray-800">Create an account</h2>
                    <p className="mt-1 text-sm text-gray-500">Use your email and password to register</p>
                </div>

                {error && (
                    <div className="mb-4 text-sm text-red-700 bg-red-100 rounded px-3 py-2">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="mt-1 relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
                                className="absolute inset-y-0 right-2 px-2 text-sm text-gray-500 focus:outline-none"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center text-sm">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-gray-600">Remember me</span>
                        </label>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500" onClick={(e) => { e.preventDefault(); navigate('/forgot-password') }}>
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none disabled:opacity-60"
                        >
                            {loading ? 'Signing up...' : 'Create account'}
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-4 w-full flex justify-center space-x-4">
                        <button
                            type="button"
                            className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm hover:bg-gray-50"
                            onClick={handleGoogleLogin}
                        >
                            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <path d="M21.35 11.1h-9.18v2.96h5.27c-.23 1.42-1.35 3.28-5.27 3.28-3.17 0-5.76-2.62-5.76-5.85s2.59-5.85 5.76-5.85c1.81 0 3.03.77 3.73 1.43l2.55-2.46C17.69 3.1 15.8 2 12.17 2 6.95 2 2.83 6.12 2.83 11.32s4.12 9.32 9.34 9.32c5.39 0 8.94-3.78 8.94-9.04 0-.6-.07-1.06-.76-1.8z" fill="#EA4335"/>
                            </svg>
                            Google
                        </button>
                    </div>
                </div>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <a onClick={(e) => { e.preventDefault(); navigate('/login') }} className="text-indigo-600 font-medium hover:text-indigo-500">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    )
}

export default Register