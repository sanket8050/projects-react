import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getNearbyShops } from '../services/firebase.jsx'
import { calculateDistance } from '../utils/helpers.jsx'

export const useNearbyShops = (queryText = '', type = '') => {
  const [shops, setShops] = useState([])
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => setError(err.message)
    )
  }, [])

  const { isLoading } = useQuery({
    queryKey: ['shops', location, queryText, type],
    queryFn: () => new Promise((resolve) => {
      if (!location) return resolve([])
      getNearbyShops(location.lat, location.lng, 5000, queryText, type, (shops) => {
        setShops(shops)
        resolve(shops)
      })
    }),
    enabled: !!location,
  })

  return { shops, isLoading, error, location }
}