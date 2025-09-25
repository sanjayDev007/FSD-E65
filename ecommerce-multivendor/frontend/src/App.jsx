import { useState } from 'react'
import './App.css'
import { Route, Router, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/dashboard'
import Register from './pages/Register'

function App() {

  return (
    <>
        <Routes>
          <Route path="/" element={<h1>Hello World</h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    </>
  )
}

export default App
