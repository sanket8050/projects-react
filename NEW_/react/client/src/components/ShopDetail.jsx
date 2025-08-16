"use client"

import { useState } from "react"
import { formatTimestamp, getBusinessTypeDisplay, getStatusColor, formatPrice } from "../utils/helpers"
import Button from "./common/Button"

const ShopDetail = ({ shop }) => {
  const [showFullMenu, setShowFullMenu] = useState(false)
  const statusColor = getStatusColor(shop.isOpen)

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`
  }

  const handleWhatsApp = (whatsapp) => {
    window.open(`https://wa.me/${whatsapp.replace(/\D/g, "")}`, "_blank")
  }

  const handleDirections = () => {
    const { lat, lng } = shop.location
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank")
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{shop.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                {getBusinessTypeDisplay(shop.type)}
              </span>
              {shop.distance && (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                  {shop.distance} km away
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
              {shop.isOpen ? "Open Now" : "Closed"}
            </span>
            {(shop.openTime || shop.closeTime) && (
              <p className="text-sm text-gray-600">
                {shop.openTime || "N/A"} - {shop.closeTime || "N/A"}
              </p>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Location</h3>
              <p className="text-gray-600">{shop.location.address}</p>
            </div>
            <Button variant="primary" size="sm" onClick={handleDirections}>
              Get Directions
            </Button>
          </div>
        </div>
      </div>

      {/* Announcement */}
      {shop.announcement && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-yellow-800 mb-2">Announcement</h3>
          <p className="text-yellow-700">{shop.announcement}</p>
        </div>
      )}

      {/* Menu */}
      {shop.todayMenu && shop.todayMenu.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Today's Menu</h2>
            {shop.todayMenu.length > 5 && (
              <Button variant="secondary" size="sm" onClick={() => setShowFullMenu(!showFullMenu)}>
                {showFullMenu ? "Show Less" : `Show All (${shop.todayMenu.length})`}
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {(showFullMenu ? shop.todayMenu : shop.todayMenu.slice(0, 5)).map((item, index) => (
              <div
                key={index}
                className={`flex justify-between items-center p-3 rounded-lg border ${
                  item.available ? "bg-white border-gray-200" : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex-1">
                  <h4 className={`font-medium ${item.available ? "text-gray-900" : "text-gray-400 line-through"}`}>
                    {item.name}
                  </h4>
                  {item.notes && <p className="text-sm text-gray-600 mt-1">{item.notes}</p>}
                  {!item.available && (
                    <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mt-1">
                      Not Available
                    </span>
                  )}
                </div>
                {item.price && (
                  <div className="text-right">
                    <span className={`text-lg font-semibold ${item.available ? "text-gray-900" : "text-gray-400"}`}>
                      {formatPrice(item.price)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!showFullMenu && shop.todayMenu.length > 5 && (
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">Showing 5 of {shop.todayMenu.length} items</p>
            </div>
          )}
        </div>
      )}

      {/* Contact Information */}
      {(shop.contact?.phone || shop.contact?.whatsapp) && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {shop.contact.phone && (
              <Button
                variant="primary"
                onClick={() => handleCall(shop.contact.phone)}
                className="flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Call {shop.contact.phone}
              </Button>
            )}
            {shop.contact.whatsapp && (
              <Button
                variant="success"
                onClick={() => handleWhatsApp(shop.contact.whatsapp)}
                className="flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
                WhatsApp
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-600">
          Last updated {formatTimestamp(shop.lastUpdated)}
          {shop.owner && <span> • Managed by {shop.owner.name}</span>}
        </p>
      </div>
    </div>
  )
}

export default ShopDetail
