"use client"

import { useState, useEffect } from "react"
import ShopCard from "./ShopCard"
import { useNearbyShops } from "../hooks/useNearbyShops"
import { useSocket } from "../context/SocketContext"

const ShopList = ({ userLocation, searchFilters }) => {
  const { connected } = useSocket()
  const [sortedShops, setSortedShops] = useState([])

  const { shops, loading, error, refetch } = useNearbyShops({
    location: userLocation,
    query: searchFilters.query,
    type: searchFilters.type,
    radius: searchFilters.radius,
  })

  // Apply sorting and additional filters
  useEffect(() => {
    let filtered = [...shops]

    // Apply quick filters
    if (searchFilters.quickFilter) {
      switch (searchFilters.quickFilter) {
        case "Open Now":
          filtered = filtered.filter((shop) => shop.isOpen)
          break
        case "Has Menu":
          filtered = filtered.filter((shop) => shop.todayMenu && shop.todayMenu.length > 0)
          break
        case "Recently Updated":
          filtered = filtered.filter((shop) => {
            const lastUpdated = new Date(shop.lastUpdated)
            const now = new Date()
            const hoursDiff = (now - lastUpdated) / (1000 * 60 * 60)
            return hoursDiff <= 24
          })
          break
        case "Popular":
          filtered = filtered.filter((shop) => shop.followersCount > 0)
          break
      }
    }

    // Apply sorting
    switch (searchFilters.sort) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "updated":
        filtered.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
        break
      case "rating":
        // Mock rating sort - in real app, you'd have actual ratings
        filtered.sort((a, b) => (b.followersCount || 0) - (a.followersCount || 0))
        break
      case "distance":
      default:
        if (userLocation) {
          filtered.sort((a, b) => (a.distance || 999) - (b.distance || 999))
        }
        break
    }

    setSortedShops(filtered)
  }, [shops, searchFilters, userLocation])

  const getFilterSummary = () => {
    const parts = []
    if (searchFilters.query) parts.push(`"${searchFilters.query}"`)
    if (searchFilters.type !== "all") parts.push(searchFilters.type)
    if (searchFilters.quickFilter) parts.push(searchFilters.quickFilter.toLowerCase())
    return parts.length > 0 ? ` for ${parts.join(", ")}` : ""
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {loading ? "Searching..." : `${sortedShops.length} business${sortedShops.length !== 1 ? "es" : ""} found`}
              {getFilterSummary()}
            </h2>
            {userLocation && !loading && (
              <p className="text-sm text-gray-600 mt-1">
                Within {searchFilters.radius}km • Sorted by {searchFilters.sort}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <div className={`w-2 h-2 rounded-full mr-2 ${connected ? "bg-green-500" : "bg-red-500"}`}></div>
              {connected ? "Live updates" : "Offline"}
            </div>

            {!loading && sortedShops.length > 0 && (
              <button
                onClick={() => refetch()}
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg inline-block">
              {error}
            </div>
          </div>
        ) : sortedShops.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses found</h3>
            <p className="text-gray-600 mb-4">
              {searchFilters.query || searchFilters.type !== "all" || searchFilters.quickFilter
                ? "Try adjusting your search filters or expanding your search area"
                : userLocation
                  ? "No businesses available in your area"
                  : "Enable location to find nearby businesses"}
            </p>
            {!userLocation && (
              <p className="text-sm text-gray-500">
                Or try searching for a specific city in the location settings above
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ShopList
