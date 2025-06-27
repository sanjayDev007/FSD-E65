import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams, useNavigate, Link } from 'react-router-dom'

function SingleProduct() {
  const products = useSelector(state => state.products)
  const [product, setProduct] = useState(null)
  const { id } = useParams()
  const navigate = useNavigate()
function getProduct(id) {
return products.find(product => product.id === parseInt(id))
}
  useEffect(() => {
    const foundProduct = getProduct(id)
    if (foundProduct) {
      setProduct(foundProduct)
    } else {
      navigate('/products')
    }
  }, [id, getProduct, navigate])

  const handleDelete = () => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    onDelete(parseInt(id))
    navigate('/products')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Inactive': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!product) return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">Product not found</p>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          ← Back to Products
        </button>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <Link to="/products" className="hover:text-gray-700">Products</Link>
          <span>›</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600">Product ID: {product.id}</p>
          </div>
          
          <div className="flex space-x-2">
            <Link
              to={`/update-product/${product.id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
            >
              Edit Product
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
            >
              Delete Product
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Details Card */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Product Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{product.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Price</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900">${product.price.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Stock Quantity</dt>
              <dd className="mt-1 text-sm text-gray-900">{product.stock} units</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                  {product.status}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Timestamps Card */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Timestamps</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(product.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(product.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Days Since Created</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {Math.floor((new Date() - new Date(product.createdAt)) / (1000 * 60 * 60 * 24))} days
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Inventory Status Card */}
      <div className="mt-6 bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">${(product.price * product.stock).toFixed(2)}</div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{product.stock}</div>
            <div className="text-sm text-gray-600">Units in Stock</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {product.stock > 10 ? 'High' : product.stock > 5 ? 'Medium' : 'Low'}
            </div>
            <div className="text-sm text-gray-600">Stock Level</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleProduct
