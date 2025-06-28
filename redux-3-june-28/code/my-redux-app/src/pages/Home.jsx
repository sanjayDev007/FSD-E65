import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Home() {
  const products = useSelector(state => state.product);
  const totalProducts = products.length
  const activeProducts = products.filter(p => p.status === 'Active').length
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to Redux Store</h1>
        <p className="mt-2 text-gray-600">Manage your products with ease using our Redux-powered application.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📦</span>
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{totalProducts}</h3>
              <p className="text-gray-500">Total Products</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{activeProducts}</h3>
              <p className="text-gray-500">Active Products</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">${totalValue.toFixed(2)}</h3>
              <p className="text-gray-500">Total Inventory Value</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{totalProducts - activeProducts}</h3>
              <p className="text-gray-500">Inactive Products</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/products" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📦</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">View Products</h3>
              <p className="text-gray-500">Browse and manage your product inventory</p>
            </div>
          </div>
        </Link>

        <Link to="/add-product" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">➕</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Add Product</h3>
              <p className="text-gray-500">Create new products for your store</p>
            </div>
          </div>
        </Link>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">📈</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Analytics</h3>
              <p className="text-gray-500">Track your store performance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
