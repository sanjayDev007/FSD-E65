import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

function AdminLayout() {
  return (
    <>
      <h1 className="sr-only">Admin</h1>
      <Navbar name="Admin" />
      <Outlet />
    </>
  )
}

export default AdminLayout
