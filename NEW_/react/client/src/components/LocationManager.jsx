"use client"

import { useState } from "react"
import { getCurrentLocation } from "../utils/helpers"
import Button from "./common/Button"
import Modal from "./common/Modal"

const LocationManager = ({ onLocationChange, currentLocation }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showManualInput, setShowManualInput] = useState(false)
  const [manualAddress, setManualAddress] = useState("")
  const [searchingAddress, setSearchingAddress] = useState(false)

  const handleGetCurrentLocation = async () => {
    setLoading(true)
    setError("")

    try {
      const location = await getCurrentLocation()
      onLocationChange(location)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleManualLocationSearch = async () => {
    if (!manualAddress.trim()) return

    setSearchingAddress(true)
    setError("")

    try {
      // Use a geocoding service (in a real app, you'd use Google Maps API or similar)
      // For demo purposes, we'll simulate with some common locations
      const mockLocations = {
        delhi: { lat: 28.6139, lng: 77.209, address: "Delhi, India" },
        mumbai: { lat: 19.076, lng: 72.8777, address: "Mumbai, India" },
        bangalore: { lat: 12.9716, lng: 77.5946, address: "Bangalore, India" },
        chennai: { lat: 13.0827, lng: 80.2707, address: "Chennai, India" },
        kolkata: { lat: 22.5726, lng: 88.3639, address: "Kolkata, India" },
      }

      const searchKey = manualAddress.toLowerCase()
      const foundLocation = mockLocations[searchKey]

      if (foundLocation) {
        onLocationChange(foundLocation)
        setShowManualInput(false)
        setManualAddress("")
      } else {
        // In a real app, you'd make an API call to a geocoding service
        setError("Location not found. Try 'Delhi', 'Mumbai', 'Bangalore', 'Chennai', or 'Kolkata'")
      }
    } catch (err) {
      setError("Failed to search location")
    } finally {
      setSearchingAddress(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Current Location Display */}
      {currentLocation ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-green-800 font-medium">Location detected</p>
                <p className="text-green-600 text-sm">
                  {currentLocation.address || `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`}
                </p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setShowManualInput(true)}>
              Change
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="text-center">
            <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
            </svg>
            <p className="text-gray-600 mb-3">Enable location to find nearby businesses</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button variant="primary" size="sm" onClick={handleGetCurrentLocation} disabled={loading}>
                {loading ? "Getting Location..." : "Use Current Location"}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setShowManualInput(true)}>
                Enter Manually
              </Button>
            </div>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>
        </div>
      )}

      {/* Manual Location Input Modal */}
      <Modal isOpen={showManualInput} onClose={() => setShowManualInput(false)} title="Set Your Location">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search for your city</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
                className="input flex-1"
                placeholder="Enter city name (e.g., Delhi, Mumbai)"
                onKeyPress={(e) => e.key === "Enter" && handleManualLocationSearch()}
              />
              <Button
                variant="primary"
                onClick={handleManualLocationSearch}
                disabled={searchingAddress || !manualAddress.trim()}
              >
                {searchingAddress ? "Searching..." : "Search"}
              </Button>
            </div>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-3">Or use your current location:</p>
            <Button variant="secondary" onClick={handleGetCurrentLocation} disabled={loading} className="w-full">
              {loading ? "Getting Location..." : "Use Current Location"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default LocationManager
