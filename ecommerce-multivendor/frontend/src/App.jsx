import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import Layout from './components/Layout'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Products from './pages/Products'
import AdminLayout from './components/AdminLayout'
import ShippingAddress from './pages/ShippingAddress'
import Checkout from './pages/Checkout'

function App() {

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="cart" element={<Cart />} />
          <Route path="orders" element={<Orders />} />
          <Route path="shipping-address" element={<ShippingAddress />} />
          <Route path="checkout" element={<Checkout />} /> 
        </Route>
        <Route path='/admin/*' element={<AdminLayout />}>
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='products' element={<Products />} />
          <Route path='orders' element={<Orders />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
