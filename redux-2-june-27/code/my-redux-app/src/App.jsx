import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import Home from './pages/Home'
import Products from './pages/Products'
import SingleProduct from './pages/SingleProduct'
import AddProducts from './pages/AddProducts'
import UpdateProducts from './pages/UpdateProducts'
import { Provider } from 'react-redux'
import store from './redux/store'
import Carts from './pages/Carts'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:id" element={<SingleProduct />} />
            <Route path="add-product" element={<AddProducts />} />
            <Route path="update-product/:id" element={<UpdateProducts />} />
            <Route path="carts" element={<Carts />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  )
}

export default App