export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // Distance in km
}

export const formatTimestamp = (date) => {
  if (!date) return 'Never'
  const now = new Date()
  const diff = (now - date) / 1000 / 60 // Minutes
  if (diff < 60) return `${Math.round(diff)} mins ago`
  if (diff < 1440) return `${Math.round(diff / 60)} hours ago`
  return date.toLocaleString()
}