import React, { useEffect, useMemo, useState } from 'react'
import useProtected from '../hooks/useProtected'
import { getProducts } from '../api'
import { useDispatch } from 'react-redux'
import { ADD_TO_CART } from '../store/actions/cartActions'

function StarRating({ rating = 0 }) {
  
  const full = Math.floor(rating)
  const stars = Array.from({ length: 5 }, (_, i) => i < full)
  return (
    <div className="flex items-center gap-1" aria-label={`Rating ${rating} of 5`}>
      {stars.map((on, idx) => (
        <svg
          key={idx}
          className={`h-4 w-4 ${on ? 'text-yellow-400' : 'text-gray-300'}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118L10.95 13.91a1 1 0 00-1.175 0l-2.285 1.663c-.784.57-1.838-.197-1.539-1.118l1.07-3.293a1 1 0 00-.364-1.117L3.855 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-xs text-gray-500">{rating.toFixed(1)}</span>
    </div>
  )
}

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const hasDiscount = product.compareAt && product.compareAt > product.price
  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {product.featured && (
        <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-700 px-2.5 py-1 text-xs font-semibold">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Featured
        </span>
      )}
      <div className="aspect-[4/3] w-full overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-indigo-600">${product.price.toFixed(2)}</span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through">${product.compareAt.toFixed(2)}</span>
              )}
            </div>
            <StarRating rating={product.rating || 4.2} />
          </div>
          <button
            onClick={() => dispatch({ type: ADD_TO_CART, payload: product })}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 12.39a2 2 0 002 1.61h9.72a2 2 0 001.98-1.75L23 6H6"></path>
            </svg>
            Add
          </button>
        </div>
        {product.tags?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {product.tags.map((t) => (
              <span key={t} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">{t}</span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function Products() { 
    const { data: user } = useProtected();
    const categories = useMemo(() => ['all', 'electronics', 'fashion', 'home', 'books', 'toys'], [])

    const [products, setProducts] = useState([])
    const [query, setQuery] = useState('')
    const [category, setCategory] = useState('all')
    const [sort, setSort] = useState('popularity')
    
    // Pagination and loading states
    const [page, setPage] = useState(1)
    const [limit] = useState(12) // Items per page
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    
    // Ref for intersection observer
    const observerRef = React.useRef(null)
    const lastProductRef = React.useCallback((node) => {
        if (loading) return
        if (observerRef.current) observerRef.current.disconnect()
        
        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage((prevPage) => prevPage + 1)
            }
        })
        
        if (node) observerRef.current.observe(node)
    }, [loading, hasMore])
    
    // Fetch products function
    const fetchProducts = async (pageNum, isInitial = false) => {
        if (loading) return
        
        setLoading(true)
        const queryParams = {
            page: pageNum,
            limit: limit,
            search: query,
            category: category !== 'all' ? category : undefined,
            sort: sort
        }
        
        const result = await getProducts(queryParams)
        
        if (result.success) {
            const newProducts = result.products || []
            
            if (isInitial) {
                setProducts(newProducts)
            } else {
                setProducts((prev) => [...prev, ...newProducts])
            }
            
            // Check if there are more products to load
            setHasMore(newProducts.length === limit)
        }
        
        setLoading(false)
        if (isInitial) setInitialLoading(false)
    }
    
    // Initial load
    useEffect(() => {
        setInitialLoading(true)
        setProducts([])
        setPage(1)
        setHasMore(true)
        fetchProducts(1, true)
    }, [query, category, sort])
    
    // Load more when page changes
    useEffect(() => {
        if (page > 1) {
            fetchProducts(page)
        }
    }, [page])
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Explore Products</h1>
        
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full sm:w-64 rounded-lg border border-gray-300 bg-white px-3 py-2 pl-9 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                />
                <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>
                ))}
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              >
                <option value="popularity">Sort: Popularity</option>
                <option value="price-asc">Sort: Price (Low to High)</option>
                <option value="price-desc">Sort: Price (High to Low)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* All products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">All Products</h2>
          <span className="text-sm text-gray-500">{products.length} items</span>
        </div>
        
        {initialLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>
              <p className="text-sm text-gray-500">Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => {
                // Attach ref to the last product for infinite scroll
                if (products.length === index + 1) {
                  return (
                    <div key={product._id} ref={lastProductRef}>
                      <ProductCard product={product} />
                    </div>
                  )
                } else {
                  return <ProductCard key={product._id} product={product} />
                }
              })}
            </div>
            
            {/* Loading indicator for lazy load */}
            {loading && !initialLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-600"></div>
                  <p className="text-sm text-gray-500">Loading more products...</p>
                </div>
              </div>
            )}
            
            {/* No more products message */}
            {!hasMore && products.length > 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">You've reached the end of the list</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Products