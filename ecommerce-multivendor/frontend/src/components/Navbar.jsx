import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Navbar() {
  const navigate = useNavigate();
  const cartItemsCount = useSelector((state) => state.cart.items.length);
  return (
    <nav className="bg-indigo-600 text-white shadow-lg sticky w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold">Ecommerce MultiVendor</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "bg-indigo-800 px-3 py-2 rounded-md text-sm font-medium"
                  : "hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive
                  ? "bg-indigo-800 px-3 py-2 rounded-md text-sm font-medium"
                  : "hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
              }
            >
              Products
            </NavLink>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                isActive
                  ? "bg-indigo-800 px-3 py-2 rounded-md text-sm font-medium"
                  : "hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
              }
            >
              Cart <span className="text-xs bg-indigo-600 text-white rounded-full px-1">{cartItemsCount}</span>
            </NavLink>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                isActive
                  ? "bg-indigo-800 px-3 py-2 rounded-md text-sm font-medium"
                  : "hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
              }
            >
              Orders
            </NavLink>
            <a
              className='hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium cursor-pointer'
              onClick={()=>{
                localStorage.removeItem('token');
                navigate('/login');
              }}
            >
              Logout
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
