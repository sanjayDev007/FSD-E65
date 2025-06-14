import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Listing from './components/Listing'

function App() {
  const [movies, setMovies] = useState([]);
  return (
   <>
   <Navbar setMovies={setMovies}/>
   <Listing movies={movies} setMovies={setMovies}/>
   </>
  )
}

export default App