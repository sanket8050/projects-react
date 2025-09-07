import React, { useState } from 'react';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-xl fixed top-0 left-0 right-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-3xl font-extrabold text-indigo-400 hover:text-indigo-300 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105">
                Store
              </h1>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-12">
              <a href="#" className="text-gray-200 hover:text-indigo-300 font-semibold text-lg tracking-wide transition duration-300 ease-in-out relative group">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#" className="text-gray-200 hover:text-indigo-300 font-semibold text-lg tracking-wide transition duration-300 ease-in-out relative group">
                Products
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#" className="text-gray-200 hover:text-indigo-300 font-semibold text-lg tracking-wide transition duration-300 ease-in-out relative group">
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#" className="text-gray-200 hover:text-indigo-300 font-semibold text-lg tracking-wide transition duration-300 ease-in-out relative group">
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>

            {/* Search & Cart */}
            <div className="flex items-center space-x-6">
              <div className="hidden lg:flex items-center relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="px-5 py-2 w-72 border border-gray-700 bg-gray-800/50 backdrop-blur-sm text-white rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition duration-300 ease-in-out"
                />
                <button className="absolute right-0 top-0 mt-2 mr-2 p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full transition duration-300 ease-in-out transform hover:scale-110">
                  <Search className="w-5 h-5" />
                </button>
              </div>
              
              <button className="p-2 text-gray-200 hover:text-indigo-300 transition duration-300 ease-in-out transform hover:scale-110 relative">
                <ShoppingCart className="w-7 h-7" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </button>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 text-gray-200 hover:text-indigo-300 transition duration-300 ease-in-out transform hover:scale-110"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-gray-800/95 backdrop-blur-sm border-t border-gray-700/50 py-6 animate-slide-down">
              <div className="flex flex-col space-y-6 px-6">
                <a href="#" className="text-gray-200 hover:text-indigo-300 font-semibold text-lg tracking-wide transition duration-300 ease-in-out">Home</a>
                <a href="#" className="text-gray-200 hover:text-indigo-300 font-semibold text-lg tracking-wide transition duration-300 ease-in-out">Products</a>
                <a href="#" className="text-gray-200 hover:text-indigo-300 font-semibold text-lg tracking-wide transition duration-300 ease-in-out">About</a>
                <a href="#" className="text-gray-200 hover:text-indigo-300 font-semibold text-lg tracking-wide transition duration-300 ease-in-out">Contact</a>
                <div className="flex pt-4">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="flex-1 px-5 py-2 border border-gray-700 bg-gray-800/50 backdrop-blur-sm text-white rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition duration-300 ease-in-out"
                  />
                  <button className="ml-2 p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full transition duration-300 ease-in-out transform hover:scale-110">
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

   
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;