import React, { useEffect, useState } from 'react'
import Card from './Card'
import Modal from './Modal'

function Listing({movies, setMovies}) {
    const [modalOpen, setModalOpen] = useState(false);
    const [movieDetails, setMovieDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    useEffect(() => {
        fetch('https://omdbapi.com/?apikey=267b6ea0&s=the%20a&page='+ page)
            .then(response => response.json())
            .then(data => setMovies((prevMovies) => [...prevMovies, ...(data.Search || [])]))
            .catch(error => console.error('Error fetching movies:', error));
    },[page]);

    const handleCardClick = async (movieId) => {
        setModalOpen(true);
        setLoading(true);
        setMovieDetails(null);

        try {
            const response = await fetch(`https://omdbapi.com/?apikey=267b6ea0&i=${movieId}&plot=full`);
            const data = await response.json();
            setMovieDetails(data);
        } catch (error) {
            console.error('Error fetching movie details:', error);
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setMovieDetails(null);
    };

    return (
        <div className="listing min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 mb-4">
                        🎬 Movie Galaxy
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Discover amazing movies and dive into the world of entertainment
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-red-500 mx-auto mt-4 rounded-full"></div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                    {movies.map((movie, idx) => (
                        <Card 
                            key={movie.imdbID || idx} 
                            title={movie.Title} 
                            poster={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image'} 
                            year={movie.Year}
                            movieId={movie.imdbID}
                            handleCardClick={handleCardClick}
                        />
                    ))}
                </div>
                
                {movies.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-300 text-lg">No Movies Found</p>
                    </div>
                )}
            </div>
            <div className="flex justify-center mt-12">
                <button 
                    onClick={() => setPage(prev => prev + 1)} 
                    className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 transition-colors duration-300"
                >
                    Load More
                </button>
            </div>
            <Modal 
                isOpen={modalOpen}
                onClose={closeModal}
                movieDetails={movieDetails}
                loading={loading}
            />
        </div>
    )
}

export default Listing