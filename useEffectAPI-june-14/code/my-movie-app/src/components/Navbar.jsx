import axios from 'axios';
import React from 'react'

function Navbar({setMovies}) {
    const [searchQuery, setSearchQuery] = React.useState('');
    async function handleSearch(event) {
        event.preventDefault();
        const query = searchQuery.trim();
        if (query.length > 2) {
            try {
                const response = await axios(`https://omdbapi.com/?apikey=267b6ea0&s=${query}`);
                setMovies(response.data.Search || []);
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        } else {
            fetch('https://omdbapi.com/?apikey=267b6ea0&s=the%20a&page=1')
            .then(response => response.json())
            .then(data => setMovies(data.Search || []))
            .catch(error => console.error('Error fetching movies:', error));
        }
    }
    return (
        <nav className="bg-gray-900 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <h1 className="text-white text-xl font-bold">Movie Galaxy</h1>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center">
                        <div className="relative">
                            <input
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                }}
                                type="text"
                                placeholder="Search..."
                                className="bg-gray-800 text-white px-4 py-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={handleSearch}>
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="md:hidden">
                        <button className="text-gray-400 hover:text-white hover:bg-gray-700 px-2 py-2 rounded-md">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar