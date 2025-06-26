import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

function ComD() {
    let count = useSelector((state) => state.count);
    const dispatch = useDispatch();
  return (
    <div>
        Component D
        <br />
        Count: {count}
        <div className="flex gap-4 mt-6 justify-center">
        <button 
          onClick={() => dispatch({ type: 'INCREMENT' })}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Increment Count
        </button>
        <button 
          onClick={() => dispatch({ type: 'DECREMENT' })}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Decrement Count
        </button>
      </div>
    </div>
  )
}

export default ComD