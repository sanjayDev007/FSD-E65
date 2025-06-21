import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`https://fakestoreapi.com/products/${id}`);
                if (!response.ok) throw new Error('Product not found');
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <div className="text-center py-12 text-xl">Loading...</div>;
    if (error) return <div className="text-center py-12 text-xl text-red-500">Error: {error}</div>;
    if (!product) return <div className="text-center py-12 text-xl text-red-500">Product not found</div>;

    return (
        <div className="max-w-6xl mx-auto p-5 font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <div className="flex justify-center">
                    <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-full max-w-96 h-96 object-contain rounded-lg shadow-lg"
                    />
                </div>
                <div>
                    <h1 className="text-3xl mb-2.5 text-gray-800">{product.title}</h1>
                    <div className="uppercase text-gray-600 text-sm mb-2.5">{product.category}</div>
                    <div className="text-3xl font-bold text-red-500 mb-4">${product.price}</div>
                    <div className="flex items-center gap-2.5 mb-5">
                        <span className="text-yellow-500 text-xl">★★★★☆</span>
                        <span className="text-gray-600">
                            {product.rating?.rate} ({product.rating?.count} reviews)
                        </span>
                    </div>
                    <p className="leading-relaxed text-gray-600 mb-7">{product.description}</p>
                    <button className="bg-blue-500 text-white border-none py-4 px-8 text-lg rounded cursor-pointer transition-colors hover:bg-blue-600">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
