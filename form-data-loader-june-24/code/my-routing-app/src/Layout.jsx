import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigation } from 'react-router-dom';

function Loading() {
    return (
        <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
                <div className="text-gray-600 font-medium">Loading...</div>
            </div>
        </div>
    );
}

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigation = useNavigation();
    const isLoading = navigation.state === 'loading';

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/', label: 'Dashboard', icon: '📊' },
        { path: '/products', label: 'Products', icon: '📦' },
        { path: '/settings', label: 'Settings', icon: '⚙️' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Navbar */}
            <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg fixed w-full top-0 z-50">
                <div className="px-4 py-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <button
                                onClick={toggleSidebar}
                                className="md:hidden mr-4 p-2 rounded-lg hover:bg-blue-500 transition-colors duration-200"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                    <span className="text-blue-600 font-bold">M</span>
                                </div>
                                <h1 className="text-xl font-bold">My App</h1>
                            </div>
                        </div>
                        <div className="hidden md:flex space-x-1">
                            <Link to="/" className="hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors duration-200">Home</Link>
                            <Link to="/about" className="hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors duration-200">About</Link>
                            <Link to="/contact" className="hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors duration-200">Contact</Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex pt-16">
                {/* Sidebar */}
                <aside className={`bg-white shadow-xl border-r border-gray-200 transition-transform duration-300 ease-in-out 
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                    md:translate-x-0 fixed md:static w-64 h-screen md:h-auto z-40`}>
                    <div className="p-6">
                        <div className="mb-8">
                            <h2 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4">Navigation</h2>
                        </div>
                        <ul className="space-y-2">
                            {navItems.map((item) => (
                                <li key={item.path}>
                                    <Link 
                                        to={item.path}
                                        className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                                            isActive(item.path) 
                                                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <span className="text-lg">{item.icon}</span>
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300"
                        onClick={toggleSidebar}
                    ></div>
                )}

                {/* Main Content */}
                <main className="flex-1 p-6 md:ml-0 min-h-screen">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 min-h-[calc(100vh-8rem)] p-6">
                            {isLoading ? <Loading /> : <Outlet />}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;