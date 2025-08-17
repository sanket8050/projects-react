export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in kilometers
  return Math.round(distance * 100) / 100 // Round to 2 decimal places
}

const deg2rad = (deg) => {
  return deg * (Math.PI / 180)
}

// Format timestamp for display
export const formatTimestamp = (timestamp) => {
  const now = new Date()
  const date = new Date(timestamp)
  const diffInMinutes = Math.floor((now - date) / (1000 * 60))

  if (diffInMinutes < 1) {
    return "Just now"
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60)
    return `${hours} hour${hours > 1 ? "s" : ""} ago`
  } else {
    const days = Math.floor(diffInMinutes / 1440)
    return `${days} day${days > 1 ? "s" : ""} ago`
  }
}

// Get user's current location with enhanced error handling
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"))
      return
    }

    // First try with high accuracy
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        })
      },
      (error) => {
        // If high accuracy fails, try with lower accuracy
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy,
            })
          },
          (fallbackError) => {
            let errorMessage = "Unable to retrieve location"
            switch (fallbackError.code) {
              case fallbackError.PERMISSION_DENIED:
                errorMessage = "Location access denied. Please enable location permissions in your browser settings."
                break
              case fallbackError.POSITION_UNAVAILABLE:
                errorMessage = "Location information unavailable. Please check your internet connection."
                break
              case fallbackError.TIMEOUT:
                errorMessage = "Location request timed out. Please try again."
                break
            }
            reject(new Error(errorMessage))
          },
          {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 600000, // 10 minutes
          },
        )
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  })
}

// Format price for display
export const formatPrice = (price) => {
  if (price === null || price === undefined) return "Price not set"
  return `₹${price.toFixed(2)}`
}

// Generate unique ID for menu items
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone number format (Indian)
export const isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/
  return phoneRegex.test(phone.replace(/\D/g, ""))
}

// Truncate text with ellipsis
export const truncateText = (text, maxLength) => {
  if (!text) return ""
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

// Get business type display name
export const getBusinessTypeDisplay = (type) => {
  const types = {
    hotel: "Hotel",
    mess: "Mess",
    stall: "Food Stall",
    restaurant: "Restaurant",
    shop: "Shop",
  }
  return types[type] || type
}

// Get status badge color
export const getStatusColor = (isOpen) => {
  return isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
}

// Debounce function for search with improved performance
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Enhanced location utilities
export const getLocationDisplayName = (location) => {
  if (location.address) return location.address
  return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
}

export const isLocationValid = (location) => {
  return (
    location &&
    typeof location.lat === "number" &&
    typeof location.lng === "number" &&
    location.lat >= -90 &&
    location.lat <= 90 &&
    location.lng >= -180 &&
    location.lng <= 180
  )
}

// Search utilities
export const highlightSearchTerm = (text, searchTerm) => {
  if (!searchTerm) return text
  const regex = new RegExp(`(${searchTerm})`, "gi")
  return text.replace(regex, "<mark>$1</mark>")
}

export const getSearchSuggestions = (query, items) => {
  if (!query) return []
  const lowercaseQuery = query.toLowerCase()
  return items.filter((item) => item.toLowerCase().includes(lowercaseQuery)).slice(0, 5)
}
