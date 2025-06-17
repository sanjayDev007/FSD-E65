import React from 'react'

function Login({setPage}) {
  return (
    <>
        <div className='w-[60%] bg-white p-8 rounded-lg shadow-lg'>
            <h2 className='text-2xl font-bold mb-6 text-center'>Login</h2>
            <form>
                <div className='mb-4'>
                    <label className='block text-sm font-medium mb-2' htmlFor='email'>Email</label>
                    <input type='email' id='email' className='w-full p-2 border border-gray-300 rounded' placeholder='Enter your email' />
                </div>
                <div className='mb-4'>
                    <label className='block text-sm font-medium mb-2' htmlFor='password'>Password</label>
                    <input type='password' id='password' className='w-full p-2 border border-gray-300 rounded' placeholder='Enter your password' />
                </div>
                <button type='submit' className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600'>Login</button>
            </form>
            <p className='mt-4 text-sm text-center'>
                Don't have an account? <a onClick={()=> setPage('register')} className='text-blue-500 hover:underline'>Register here</a>
            </p>
        </div>
    </>
  )
}

export default Login