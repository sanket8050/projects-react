"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useSocket } from "../context/SocketContext"
import { shopAPI } from "../services/api"
import { useForm } from "react-hook-form"
import Button from "../components/common/Button"
import Modal from "../components/common/Modal"
import StatusToggle from "../components/StatusToggle"
import MenuManager from "../components/MenuManager"
import { formatTimestamp } from "../utils/helpers"

const OwnerDashboard = () => {
  const { user, logout } = useAuth()
  const { connected } = useSocket()
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [showOnboarding, setShowOnboarding] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  useEffect(() => {
    fetchShop()
  }, [])

  const fetchShop = async () => {
    try {
      setLoading(true)
      const response = await shopAPI.getShopById("owner/my-shop")
      setShop(response.data)
    } catch (err) {
      if (err.response?.status === 404) {
        setShowOnboarding(true)
      } else {
        setError(err.response?.data?.message || "Failed to load shop")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCreateShop = async (data) => {
    try {
      setSaving(true)
      setError("")

      const shopData = {
        name: data.name,
        type: data.type,
        location: {
          address: data.address,
          lat: Number.parseFloat(data.lat),
          lng: Number.parseFloat(data.lng),
        },
        contact: {
          phone: data.phone,
          whatsapp: data.whatsapp,
        },
        openTime: data.openTime,
        closeTime: data.closeTime,
      }

      const response = await shopAPI.createShop(shopData)
      setShop(response.data.shop)
      setShowOnboarding(false)
      reset()
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create shop")
    } finally {
      setSaving(false)
    }
  }

  const handleStatusToggle = async (isOpen) => {
    try {
      setSaving(true)
      const response = await shopAPI.updateShop(shop.id, { isOpen })
      setShop({ ...shop, isOpen, lastUpdated: new Date().toISOString() })
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status")
    } finally {
      setSaving(false)
    }
  }

  const handleAnnouncementUpdate = async (announcement) => {
    try {
      setSaving(true)
      const response = await shopAPI.updateShop(shop.id, { announcement })
      setShop({ ...shop, announcement, lastUpdated: new Date().toISOString() })
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update announcement")
    } finally {
      setSaving(false)
    }
  }

  const handleMenuUpdate = async (todayMenu) => {
    try {
      setSaving(true)
      const response = await shopAPI.updateShop(shop.id, { todayMenu })
      setShop({ ...shop, todayMenu, lastUpdated: new Date().toISOString() })
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update menu")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-primary-600">Statusly</h1>
              <p className="text-sm text-gray-600">Owner Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <div className={`w-2 h-2 rounded-full mr-2 ${connected ? "bg-green-500" : "bg-red-500"}`}></div>
                {connected ? "Live updates" : "Offline"}
              </div>
              <span className="text-sm text-gray-700">Hello, {user?.name}</span>
              <Button variant="secondary" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">{error}</div>}

        {shop ? (
          <div className="space-y-6">
            {/* Shop Overview */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{shop.name}</h2>
                  <p className="text-gray-600 mb-2">{shop.location.address}</p>
                  <p className="text-sm text-gray-500">Last updated: {formatTimestamp(shop.lastUpdated)}</p>
                </div>
                <StatusToggle isOpen={shop.isOpen} onToggle={handleStatusToggle} disabled={saving} />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Status Card */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
                <div className="text-center">
                  <div
                    className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-medium ${
                      shop.isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full mr-2 ${shop.isOpen ? "bg-green-500" : "bg-red-500"}`}></div>
                    {shop.isOpen ? "Open" : "Closed"}
                  </div>
                  {shop.openTime && shop.closeTime && (
                    <p className="text-sm text-gray-600 mt-2">
                      Hours: {shop.openTime} - {shop.closeTime}
                    </p>
                  )}
                </div>
              </div>

              {/* Menu Items Count */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Menu Items</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">{shop.todayMenu?.length || 0}</div>
                  <p className="text-sm text-gray-600">
                    {shop.todayMenu?.filter((item) => item.available).length || 0} available
                  </p>
                </div>
              </div>

              {/* Followers */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Followers</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">{shop.followersCount || 0}</div>
                  <p className="text-sm text-gray-600">People following your shop</p>
                </div>
              </div>
            </div>

            {/* Announcement */}
            <AnnouncementManager
              announcement={shop.announcement}
              onUpdate={handleAnnouncementUpdate}
              disabled={saving}
            />

            {/* Menu Management */}
            <MenuManager menu={shop.todayMenu || []} onUpdate={handleMenuUpdate} disabled={saving} />
          </div>
        ) : null}

        {/* Onboarding Modal */}
        <Modal isOpen={showOnboarding} onClose={() => {}} title="Set Up Your Shop" size="lg">
          <form onSubmit={handleSubmit(handleCreateShop)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                <input
                  {...register("name", { required: "Shop name is required" })}
                  type="text"
                  className="input"
                  placeholder="Enter your shop name"
                />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                <select {...register("type", { required: "Business type is required" })} className="input">
                  <option value="">Select type</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="hotel">Hotel</option>
                  <option value="mess">Mess</option>
                  <option value="stall">Food Stall</option>
                  <option value="shop">Shop</option>
                </select>
                {errors.type && <p className="text-sm text-red-600 mt-1">{errors.type.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                {...register("address", { required: "Address is required" })}
                className="input"
                rows={3}
                placeholder="Enter your complete address"
              />
              {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <input
                  {...register("lat", { required: "Latitude is required" })}
                  type="number"
                  step="any"
                  className="input"
                  placeholder="e.g., 28.6139"
                />
                {errors.lat && <p className="text-sm text-red-600 mt-1">{errors.lat.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <input
                  {...register("lng", { required: "Longitude is required" })}
                  type="number"
                  step="any"
                  className="input"
                  placeholder="e.g., 77.2090"
                />
                {errors.lng && <p className="text-sm text-red-600 mt-1">{errors.lng.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input {...register("phone")} type="tel" className="input" placeholder="Enter phone number" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                <input {...register("whatsapp")} type="tel" className="input" placeholder="Enter WhatsApp number" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opening Time</label>
                <input {...register("openTime")} type="time" className="input" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Closing Time</label>
                <input {...register("closeTime")} type="time" className="input" />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? "Creating..." : "Create Shop"}
              </Button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  )
}

// Announcement Manager Component
const AnnouncementManager = ({ announcement, onUpdate, disabled }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(announcement || "")

  const handleSave = () => {
    onUpdate(value)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setValue(announcement || "")
    setIsEditing(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Announcement</h3>
        {!isEditing && (
          <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)} disabled={disabled}>
            {announcement ? "Edit" : "Add"}
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="input"
            rows={4}
            placeholder="Enter announcement for your customers..."
          />
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave} disabled={disabled}>
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div>
          {announcement ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">{announcement}</p>
            </div>
          ) : (
            <p className="text-gray-500 italic">No announcement set</p>
          )}
        </div>
      )}
    </div>
  )
}

export default OwnerDashboard
