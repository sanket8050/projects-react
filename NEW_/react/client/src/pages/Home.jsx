"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import ShopList from "../components/ShopList"
import LocationManager from "../components/LocationManager"
import AdvancedSearch from "../components/AdvancedSearch"
import Button from "../components/common/Button"

const Home = () => {
  const { user, logout } = useAuth()
  const [location, setLocation] = useState(null)
  const [searchFilters, setSearchFilters] = useState({
    query: "",
    type: "all",
    radius: 10,
    sort: "distance",
  })

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation)
  }

  const handleSearch = (query) => {
    setSearchFilters((prev) => ({ ...prev, query }))
  }

  const handleFilterChange = (newFilters) => {
    setSearchFilters((prev) => ({ ...prev, ...newFilters }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">Statusly</h1>
              <span className="ml-2 text-sm text-gray-500">Local Business Platform</span>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">Hello, {user.name}</span>
                  {user.role === "owner" && (
                    <Link to="/owner">
                      <Button variant="primary" size="sm">
                        Dashboard
                      </Button>
                    </Link>
                  )}
                  <Button variant="secondary" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <Link to="/login">
                  <Button variant="primary" size="sm">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Discover Local Businesses</h2>
          <p className="text-xl mb-8 text-primary-100">
            Find nearby shops, restaurants, and services with live status updates
          </p>

          {/* Location Manager */}
          <div className="max-w-2xl mx-auto">
            <LocationManager onLocationChange={handleLocationChange} currentLocation={location} />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Advanced Search */}
        <AdvancedSearch onSearch={handleSearch} onFilterChange={handleFilterChange} currentFilters={searchFilters} />

        {/* Shop List */}
        <ShopList userLocation={location} searchFilters={searchFilters} />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Statusly. Connecting communities with local businesses.</p>
            <div className="mt-4 flex justify-center space-x-6 text-sm">
              <a href="#" className="hover:text-primary-600">
                About
              </a>
              <a href="#" className="hover:text-primary-600">
                Privacy
              </a>
              <a href="#" className="hover:text-primary-600">
                Terms
              </a>
              <a href="#" className="hover:text-primary-600">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
