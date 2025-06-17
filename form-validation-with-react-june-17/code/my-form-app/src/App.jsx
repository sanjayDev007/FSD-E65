import React from 'react'
import Login from './components/Login'
import Register from './components/Register';

function App() {
  const [page, setPage] = React.useState('register');
  return (
   <>
   <div className="container *:bg-gray-100 min-h-screen flex items-center justify-center">
    {
      page === 'register' ? (
        <Register setPage={setPage} />
      ) : page === 'login' ? (
        <Login setPage={setPage} />
      ) : null
    }
   </div>
   </>
  )
}

export default App