"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { shopAPI } from "../services/api"
import ShopDetail from "../components/ShopDetail"
import Button from "../components/common/Button"
import { useSocket } from "../context/SocketContext"

const ShopPage = () => {
  const { id } = useParams()
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { joinShop, leaveShop, onShopDetailsUpdated } = useSocket()

  useEffect(() => {
    const fetchShop = async () => {
      try {
        setLoading(true)
        const response = await shopAPI.getShopById(id)
        setShop(response.data)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load shop details")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchShop()
    }
  }, [id])

  useEffect(() => {
    if (id && shop) {
      // Join shop room for real-time updates
      joinShop(id)

      // Listen for shop details updates
      const unsubscribe = onShopDetailsUpdated((updatedShop) => {
        if (updatedShop.id === id) {
          setShop((prevShop) => ({
            ...prevShop,
            ...updatedShop,
          }))
        }
      })

      // Cleanup: leave shop room and remove listener
      return () => {
        leaveShop(id)
        if (unsubscribe) unsubscribe()
      }
    }
  }, [id, shop, joinShop, leaveShop, onShopDetailsUpdated])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shop details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg mb-4">{error}</div>
          <Link to="/">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/" className="flex items-center text-primary-600 hover:text-primary-700">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
            <div className="ml-4">
              <h1 className="text-xl font-semibold text-gray-900">Statusly</h1>
            </div>
            <RealTimeIndicator />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{shop && <ShopDetail shop={shop} />}</main>
    </div>
  )
}

const RealTimeIndicator = () => {
  const { connected } = useSocket()

  return (
    <div className="ml-auto flex items-center">
      <div className="flex items-center text-xs text-gray-500">
        <div className={`w-2 h-2 rounded-full mr-2 ${connected ? "bg-green-500" : "bg-red-500"}`}></div>
        {connected ? "Live updates" : "Offline"}
      </div>
    </div>
  )
}

export default ShopPage
