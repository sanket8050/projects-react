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

// Validate coordinates
export const isValidCoordinate = (lat, lng) => {
  return typeof lat === "number" && typeof lng === "number" && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}

// Generate menu item ID
export const generateMenuItemId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Validate menu item
export const validateMenuItem = (item) => {
  if (!item.name || typeof item.name !== "string" || item.name.trim().length === 0) {
    return { valid: false, error: "Menu item name is required" }
  }

  if (item.price !== undefined && (typeof item.price !== "number" || item.price < 0)) {
    return { valid: false, error: "Menu item price must be a positive number" }
  }

  if (item.available !== undefined && typeof item.available !== "boolean") {
    return { valid: false, error: "Menu item availability must be a boolean" }
  }

  return { valid: true }
}

// Clean and validate shop data
export const validateShopData = (shopData) => {
  const errors = []

  if (!shopData.name || typeof shopData.name !== "string" || shopData.name.trim().length === 0) {
    errors.push("Shop name is required")
  }

  if (!shopData.type || !["hotel", "mess", "stall", "restaurant", "shop"].includes(shopData.type)) {
    errors.push("Valid shop type is required")
  }

  if (!shopData.location || !shopData.location.lat || !shopData.location.lng || !shopData.location.address) {
    errors.push("Complete location information is required")
  } else if (!isValidCoordinate(shopData.location.lat, shopData.location.lng)) {
    errors.push("Valid coordinates are required")
  }

  if (shopData.todayMenu && Array.isArray(shopData.todayMenu)) {
    for (let i = 0; i < shopData.todayMenu.length; i++) {
      const validation = validateMenuItem(shopData.todayMenu[i])
      if (!validation.valid) {
        errors.push(`Menu item ${i + 1}: ${validation.error}`)
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
