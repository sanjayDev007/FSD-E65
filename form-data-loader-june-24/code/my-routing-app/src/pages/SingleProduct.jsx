import React, { useState, useEffect } from 'react'
import { Link, useLoaderData } from 'react-router-dom'

function SingleProduct() {
    const [error, setError] = useState(null);
    const product = useLoaderData();

    if (error) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center text-red-600">Error: {error}</div>
                    <div className="text-center mt-4">
                        <Link to="/products" className="text-blue-600 hover:text-blue-800">
                            Back to Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link to="/products" className="text-blue-600 hover:text-blue-800">
                        ← Back to Products
                    </Link>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-6">{product.name}</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Product Details</h2>
                            <div className="space-y-3">
                                <div>
                                    <span className="font-medium text-gray-600">Product ID:</span>
                                    <span className="ml-2 text-gray-800">{product.id}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">Price:</span>
                                    <span className="ml-2 text-2xl font-bold text-green-600">${product.price}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">Stock:</span>
                                    <span className="ml-2 text-gray-800">{product.stock} units</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">Status:</span>
                                    <span className={`ml-2 px-3 py-1 text-sm font-semibold rounded-full ${
                                        product.status === 'Active' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {product.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Actions</h2>
                            <div className="space-y-3">
                                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
                                    Edit Product
                                </button>
                                <button className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition">
                                    Delete Product
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleProduct
