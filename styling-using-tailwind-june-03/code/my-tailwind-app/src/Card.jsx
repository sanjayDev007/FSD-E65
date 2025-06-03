import React from 'react'

function Card({title = "Test Card", description ="Test", price = 1000, imageUrl}) {
  return (
   <>
         <div className='card flex flex-col items-center justify-center bg-white shadow-lg rounded-lg p-6 max-w-sm'>
        <div className="w-full h-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg mb-4 flex items-center justify-center">
          <i className="fas fa-laptop text-white text-6xl"></i>
        </div>
        
        <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 text-center mb-4">{description}</p>
        
        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400">
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
          </div>
          <span className="text-gray-600 ml-2 text-sm">(4.9)</span>
        </div>
        
        <div className="flex items-center justify-between w-full mb-4">
          <span className="text-2xl font-bold text-green-600">${price}</span>
          <span className="text-sm text-gray-500 line-through">$1,499</span>
        </div>
        
        <div className="flex space-x-2 mb-4">
          <button className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full hover:bg-gray-200 transition-colors">
            <i className="fas fa-heart text-red-500"></i>
          </button>
          <button className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full hover:bg-gray-200 transition-colors">
            <i className="fas fa-share-alt text-blue-500"></i>
          </button>
        </div>
        
        <button className="w-full bg-blue-600 text-black py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
          <i className="fas fa-shopping-cart mr-2"></i>
          Add to Cart
        </button>
      </div>
   </>
  )
}

export default Card