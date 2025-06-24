import { useState } from 'react'
import './App.css'
import { createBrowserRouter, Outlet } from 'react-router-dom'
import Layout from './Layout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import SingleProduct from './pages/SingleProduct'
import Users from './pages/Users'
import Settings from './pages/Settings'

function App() {
  return (
    <>
      <Layout/>
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: "/products",
        element: <Products />,
        loader: async () => {
          const response = await fetch('http://localhost:3000/api/products');
          if (!response.ok) {
            throw new Error('Failed to fetch products');
          }
          return response.json();
        }
      },
      {
        path: "/products/:id",
        element: <SingleProduct />,
        loader: async ({ params }) => {
          const response = await fetch(`http://localhost:3000/api/products/${params.id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch product');
          }
          return response.json();
        }
      },{
        path: "settings",
        element: <Settings />
      }
    ]
  }
]);

export { router };
export default App
