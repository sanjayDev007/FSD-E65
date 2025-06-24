import React from 'react'

function Users() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Users</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((user) => (
          <div key={user} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                U{user}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">User {user}</h3>
                <p className="text-gray-600">user{user}@example.com</p>
                <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  Active
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  )
}

export default Users