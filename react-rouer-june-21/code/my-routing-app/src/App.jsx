import { Link, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Navbar from './components/Navbar'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'

function App() {
  const location = useLocation()
  console.log('location:', location)
  return (
    <>
    <Navbar />
    <div className="container mx-auto p-8">
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/products'>
          <Route index element={<Products/>} />
          <Route path=':id' element={<ProductDetail/>} />
        </Route>
        {/* Catch-all route for 404 */}
        <Route path='*' element={<>
          <h2 className="text-2xl text-red-600">404 - Page Not Found</h2>
          <p className="text-gray-600">The page you are looking for does not exist.</p>
          </>} />
      </Routes>
    </div>
    </>
  )
}

export default App
