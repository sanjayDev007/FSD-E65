import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

function Layout() {
  return (
    <>
    <div className="min-h-screen bg-gray-100 *:dark:bg-gray-900 w-full *:dark:text-gray-200 *:dark:border-gray-700 relative">
      <div className="sticky top-0 z-50">
        <Navbar name="User" />
      </div>
      <Outlet />
    </div>
    </>
  )
}

export default Layout
