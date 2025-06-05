import React from 'react'

function Navbar({search, setSearch, fetchWeatherData}) {
  return (
   <>
    <nav className="w-full h-16 bg-blue-500 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className='w-1/4'>
            <h1 className="text-white text-2xl font-bold">Weather App</h1>
        </div>
        <div className='w-3/4 flex items-center justify-end'>
            <input type="text" className='bg-white outline-0 w-10/12 h-10 rounded shadow-xs text-black pl-3' onChange={(e)=>setSearch(e.target.value || '')}/>
            <button onClick={fetchWeatherData} className="ml-2 bg-white text-blue-500 px-4 py-2 rounded cursor-pointer active:scale-95">Search</button>
        </div>
    </nav>
   </>
  )
}

export default Navbar