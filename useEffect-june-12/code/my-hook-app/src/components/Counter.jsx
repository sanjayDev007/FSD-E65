import React from 'react'

function Counter() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Counter: <span className="text-indigo-600">{getCount}</span>
      </h1>
      <div className="space-y-4">
        <button 
          onClick={() => setCount(prevCount => prevCount + 1)}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
        >
          Increment
        </button>
        <button 
          onClick={() => setCount(prevCount => prevCount - 1)}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
        >
          Decrement
        </button>
        <button 
          onClick={() => setCount(0)}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
        >
          Reset
        </button>
      </div>
    </div>
  </div>
  )
}

export default Counter