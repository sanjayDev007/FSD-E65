import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const carts = useSelector(state => state.cart);
  let cartCount = carts.reduce((count, item) => count + item.quantity, 0);
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Products', href: '/products', icon: '📦' },
    { name: 'Add Product', href: '/add-product', icon: '➕' },
    { name: 'Carts', href: '/carts', icon: '🛒' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
                          <div className="flex-shrink-0 flex items-center ml-4 lg:ml-0">
                            <h1 className="text-xl font-bold text-gray-900">Redux Store</h1>
                          </div>
                        </div>

                        {/* Right side of navbar */}
                        <div className="flex items-center space-x-4">
                          <div className="hidden md:flex items-center space-x-4">
                            <span className="text-sm text-gray-500">Welcome back!</span>
                            <div className="relative cursor-pointer" onClick={()=> navigate('/carts')}>
                              <span className="text-2xl" >🛒</span>
                              {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                  {cartCount}
                                </span>
                              )}
                            </div>
                            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                              <span className="text-white text-sm font-medium">U</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </nav>

                  <div className="flex pt-16">
                    {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg lg:shadow-none border-r border-gray-200 transition-transform duration-300 ease-in-out lg:transition-none`}>
          <div className="flex flex-col h-full pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 lg:hidden">
              <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="ml-auto inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`${
                    isActive(item.href)
                      ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                  { item.name === 'Carts' && cartCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 z-30 bg-gray-600 bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main content */}
        <div className="flex-1 lg:ml-0">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Layout