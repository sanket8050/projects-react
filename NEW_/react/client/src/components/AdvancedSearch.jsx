"use client"

import { useState, useEffect, useRef } from "react"
import { debounce } from "../utils/helpers"

const AdvancedSearch = ({ onSearch, onFilterChange, currentFilters = {} }) => {
  const [searchQuery, setSearchQuery] = useState(currentFilters.query || "")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const searchRef = useRef(null)

  // Mock search suggestions - in a real app, these would come from an API
  const mockSuggestions = [
    "Pizza",
    "Burger",
    "Chinese food",
    "South Indian",
    "North Indian",
    "Biryani",
    "Dosa",
    "Sandwich",
    "Coffee",
    "Tea",
    "Juice",
    "Ice cream",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snacks",
    "Fast food",
    "Restaurant",
    "Cafe",
    "Bakery",
    "Sweet shop",
    "Grocery",
    "Medical store",
    "Stationery",
  ]

  const debouncedSearch = debounce((query) => {
    onSearch(query)
  }, 300)

  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery)
      // Filter suggestions based on query
      const filtered = mockSuggestions
        .filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5)
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
      debouncedSearch("")
    }
  }, [searchQuery, debouncedSearch])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
    onSearch(suggestion)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    onSearch("")
  }

  const businessTypes = [
    { value: "all", label: "All Types", icon: "🏪" },
    { value: "restaurant", label: "Restaurants", icon: "🍽️" },
    { value: "hotel", label: "Hotels", icon: "🏨" },
    { value: "mess", label: "Mess", icon: "🍛" },
    { value: "stall", label: "Food Stalls", icon: "🍜" },
    { value: "shop", label: "Shops", icon: "🛍️" },
  ]

  const sortOptions = [
    { value: "distance", label: "Distance" },
    { value: "name", label: "Name" },
    { value: "rating", label: "Rating" },
    { value: "updated", label: "Recently Updated" },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Find Businesses</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Advanced Search</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Search Input with Suggestions */}
      <div className="relative" ref={searchRef}>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            className="input pl-10 pr-10"
            placeholder="Search by name, food items, or services..."
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center"
              >
                <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Business Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
          <select
            value={currentFilters.type || "all"}
            onChange={(e) => onFilterChange({ type: e.target.value })}
            className="input"
          >
            {businessTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Distance Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Distance: {currentFilters.radius || 10} km
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={currentFilters.radius || 10}
            onChange={(e) => onFilterChange({ radius: Number.parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1km</span>
            <span>50km</span>
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            value={currentFilters.sort || "distance"}
            onChange={(e) => onFilterChange({ sort: e.target.value })}
            className="input"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-700">Quick filters:</span>
        {["Open Now", "Has Menu", "Recently Updated", "Popular"].map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange({ quickFilter: filter })}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
              currentFilters.quickFilter === filter
                ? "bg-primary-100 border-primary-300 text-primary-700"
                : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  )
}

export default AdvancedSearch
