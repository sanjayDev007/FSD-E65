import React from 'react'

function Orders() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">You haven't placed any orders yet.</p>
        </div>
      </div>
    </div>
  )
}

export default Orders
