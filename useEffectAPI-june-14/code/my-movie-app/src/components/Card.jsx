import React from 'react'

function Card({ title, poster, year, handleCardClick , movieId}) {
  return (
    <div 
      className="card bg-white rounded-xl shadow-2xl overflow-hidden m-4 w-64 transform hover:scale-110 hover:-rotate-1 transition-all duration-300 cursor-pointer group"
      onClick={() => handleCardClick(movieId)}
    >
      <div className="relative overflow-hidden">
        <img
          src={poster}
          alt={title}
          className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold shadow-lg">
          {year}
        </div>
      </div>
      <div className="p-5 bg-gradient-to-br from-white to-gray-50">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">{title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 font-medium">Released {year}</span>
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card