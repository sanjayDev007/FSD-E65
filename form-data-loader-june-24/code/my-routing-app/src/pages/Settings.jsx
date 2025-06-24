import React from 'react'

function Settings() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter site name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter email" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h2>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
              <span className="ml-2 text-sm text-gray-700">Email notifications</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
              <span className="ml-2 text-sm text-gray-700">Push notifications</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Settings