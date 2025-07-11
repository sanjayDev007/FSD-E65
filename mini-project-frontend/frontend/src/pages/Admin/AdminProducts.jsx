import axios from 'axios';
import React, { useEffect, useState } from 'react';
import apiUrl from '../../api/apiUrl';

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [state,setState] = useState(false);
    useEffect(() => {
        const fetchProducts = async () => {
            let response = await axios.get(`${apiUrl}/products`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
                }
            })
            if (response.status === 200) {
                setProducts(response.data.products);
            } else {
                alert('Failed to fetch products');
            }
        }
        fetchProducts();
    },[state]);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: 0, description: '' });
    const [editingProduct, setEditingProduct] = useState(null);

    const handleAddProduct = async () => {
        if (newProduct.name && newProduct.price) {
           let response = await axios.post(`${apiUrl}/products`, newProduct, {
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('admin-token')}`
                }
            });
            if (response.status === 201) {
                setNewProduct({ name: '', price: '' , stock: 0, description: '' });
                setState(!state);
                alert('Product added successfully');
            } else {
                alert('Failed to add product');
            }
        }
    };

    const handleDeleteProduct = (id) => {
        setProducts(products.filter((product) => product.id !== id));
    };

    const handleUpdateProduct = () => {
        if (editingProduct.name && editingProduct.price) {
            setProducts(
                products.map((product) =>
                    product.id === editingProduct.id ? editingProduct : product
                )
            );
            setEditingProduct(null);
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-6">Admin Products</h1>

            {/* Add Product */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4">Add Product</h2>
                <div className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="border border-gray-300 rounded-lg p-2"
                    />
                    <input
                        type="number"
                        placeholder="Product Price"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="border border-gray-300 rounded-lg p-2"
                    />
                    <input
                        type="number"
                        placeholder="Product Stock"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        className="border border-gray-300 rounded-lg p-2"
                    />
                    <textarea
                        placeholder="Product Description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        className="border border-gray-300 rounded-lg p-2"
                        rows="3"
                    ></textarea>
                    <button
                        onClick={handleAddProduct}
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                    >
                        Add Product
                    </button>
                </div>
            </div>

            {/* Product List */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Product List</h2>
                <ul className="space-y-4">
                    {products.map((product) => (
                        <li key={product.id} className="flex justify-between items-center border-b pb-4">
                            {editingProduct && editingProduct.id === product.id ? (
                                <div className="flex flex-col gap-2 w-full">
                                    <input
                                        type="text"
                                        value={editingProduct.name}
                                        onChange={(e) =>
                                            setEditingProduct({ ...editingProduct, name: e.target.value })
                                        }
                                        className="border border-gray-300 rounded-lg p-2"
                                    />
                                    <input
                                        type="number"
                                        value={editingProduct.price}
                                        onChange={(e) =>
                                            setEditingProduct({ ...editingProduct, price: e.target.value })
                                        }
                                        className="border border-gray-300 rounded-lg p-2"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleUpdateProduct}
                                            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => setEditingProduct(null)}
                                            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center w-full">
                                    <span className="text-lg font-medium">
                                        {product.name} - ${product.price}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEditingProduct(product)}
                                            className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product.id)}
                                            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AdminProducts;