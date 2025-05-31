import React from 'react'

function Counter({count, setCount}) {
  return (
    <>
        <div className="counter">
            <h1>Counter</h1>
            <h2>{count}</h2>
            <button onClick={() => setCount(count + 1)}>Increment</button>
            <button onClick={() => setCount(count - 1)}>Decrement</button>
            <button onClick={() => setCount(0)}>Reset</button>
            <button onClick={() => setCount(count + 5)}>Increment by 5</button>
            <button onClick={() => setCount(count - 5)}>Decrement by 5</button>
            <button onClick={() => setCount(count * 2)}>Double</button>
        </div>
    </>
  )
}

export default Counter