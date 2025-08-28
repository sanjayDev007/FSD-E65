import { useState } from 'react'

import './App.css'
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AddChart from './pages/AddChart';

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add-chart" element={<AddChart />} />
    </Routes>
    </>

  )
}

export default App