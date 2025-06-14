import React from 'react'

function Modal({ isOpen, onClose, movieDetails, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-lg text-gray-600">Loading movie details...</p>
          </div>
        ) : movieDetails ? (
          <div className="p-6">
            {/* Movie Header */}
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <img
                src={movieDetails.Poster !== 'N/A' ? movieDetails.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}
                alt={movieDetails.Title}
                className="w-full md:w-80 h-auto rounded-lg shadow-lg"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{movieDetails.Title}</h1>
                <div className="flex flex-wrap gap-4 mb-4">
                  <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold">{movieDetails.Year}</span>
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">{movieDetails.Rated}</span>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">{movieDetails.Runtime}</span>
                </div>
                
                {/* Ratings */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Ratings</h3>
                  <div className="flex flex-wrap gap-3">
                    {movieDetails.Ratings?.map((rating, idx) => (
                      <div key={idx} className="bg-gray-100 px-3 py-2 rounded-lg">
                        <div className="text-sm text-gray-600">{rating.Source}</div>
                        <div className="font-bold text-lg">{rating.Value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed">{movieDetails.Plot}</p>
              </div>
            </div>

            {/* Movie Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Director</h3>
                  <p className="text-gray-600">{movieDetails.Director}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Writer</h3>
                  <p className="text-gray-600">{movieDetails.Writer}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Actors</h3>
                  <p className="text-gray-600">{movieDetails.Actors}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Genre</h3>
                  <p className="text-gray-600">{movieDetails.Genre}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Released</h3>
                  <p className="text-gray-600">{movieDetails.Released}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Language</h3>
                  <p className="text-gray-600">{movieDetails.Language}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Country</h3>
                  <p className="text-gray-600">{movieDetails.Country}</p>
                </div>
                {movieDetails.BoxOffice !== 'N/A' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Box Office</h3>
                    <p className="text-gray-600">{movieDetails.BoxOffice}</p>
                  </div>
                )}
              </div>
            </div>

            {movieDetails.Awards !== 'N/A' && (
              <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Awards</h3>
                <p className="text-gray-700">{movieDetails.Awards}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-lg text-gray-600">Failed to load movie details</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal