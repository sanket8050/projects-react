"use client"

import { useState, useEffect, useCallback } from "react"
import { shopAPI } from "../services/api"
import { useSocket } from "../context/SocketContext"

export const useNearbyShops = ({ location, query = "", type = "all", radius = 10 }) => {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { onShopUpdated, onShopCreated, onShopDeleted } = useSocket()

  const fetchShops = useCallback(
    async (params = {}) => {
      try {
        setLoading(true)
        setError("")

        const searchParams = {
          q: params.query !== undefined ? params.query : query,
          type: params.type !== undefined ? params.type : type,
          radius: params.radius !== undefined ? params.radius : radius,
        }

        // Add location if available
        if (location) {
          searchParams.lat = location.lat
          searchParams.lng = location.lng
        }

        const response = await shopAPI.getNearbyShops(searchParams)
        setShops(response.data.shops || [])
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load shops")
        setShops([])
      } finally {
        setLoading(false)
      }
    },
    [location, query, type, radius],
  )

  useEffect(() => {
    fetchShops()
  }, [fetchShops])

  useEffect(() => {
    const unsubscribeUpdated = onShopUpdated((updatedShop) => {
      setShops((prevShops) =>
        prevShops.map((shop) =>
          shop.id === updatedShop.id
            ? {
                ...shop,
                ...updatedShop,
                // Preserve distance if it exists
                distance: shop.distance,
              }
            : shop,
        ),
      )
    })

    const unsubscribeCreated = onShopCreated((newShop) => {
      // Only add if it matches current filters
      const matchesType = type === "all" || newShop.type === type
      const matchesQuery = !query || newShop.name.toLowerCase().includes(query.toLowerCase())

      if (matchesType && matchesQuery) {
        setShops((prevShops) => {
          // Check if shop already exists to avoid duplicates
          const exists = prevShops.some((shop) => shop.id === newShop.id)
          if (!exists) {
            return [...prevShops, newShop]
          }
          return prevShops
        })
      }
    })

    const unsubscribeDeleted = onShopDeleted((deletedShop) => {
      setShops((prevShops) => prevShops.filter((shop) => shop.id !== deletedShop.id))
    })

    // Cleanup event listeners
    return () => {
      if (unsubscribeUpdated) unsubscribeUpdated()
      if (unsubscribeCreated) unsubscribeCreated()
      if (unsubscribeDeleted) unsubscribeDeleted()
    }
  }, [onShopUpdated, onShopCreated, onShopDeleted, type, query])

  const refetch = useCallback(
    (params = {}) => {
      fetchShops(params)
    },
    [fetchShops],
  )

  return {
    shops,
    loading,
    error,
    refetch,
  }
}
