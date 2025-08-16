"use client"

import { Link } from "react-router-dom"
import { formatTimestamp, getBusinessTypeDisplay, getStatusColor, formatPrice } from "../utils/helpers"

const ShopCard = ({ shop }) => {
  const statusColor = getStatusColor(shop.isOpen)

  return (
    <Link to={`/shop/${shop.id}`} className="block">
      <div className="card hover:shadow-lg transition-shadow duration-200 p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{shop.name}</h3>
            <p className="text-sm text-gray-600">{getBusinessTypeDisplay(shop.type)}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {shop.isOpen ? "Open" : "Closed"}
          </span>
        </div>

        {/* Distance */}
        {shop.distance !== null && (
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {shop.distance} km away
          </div>
        )}

        {/* Menu Preview */}
        {shop.todayMenu && shop.todayMenu.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Today's Menu</h4>
            <div className="space-y-1">
              {shop.todayMenu.slice(0, 2).map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className={`${item.available ? "text-gray-900" : "text-gray-400 line-through"}`}>
                    {item.name}
                  </span>
                  {item.price && <span className="text-gray-600 font-medium">{formatPrice(item.price)}</span>}
                </div>
              ))}
              {shop.todayMenu.length > 2 && (
                <p className="text-xs text-gray-500">+{shop.todayMenu.length - 2} more items</p>
              )}
            </div>
          </div>
        )}

        {/* Announcement */}
        {shop.announcement && (
          <div className="mb-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800 line-clamp-2">{shop.announcement}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Updated {formatTimestamp(shop.lastUpdated)}</span>
          {shop.followersCount > 0 && (
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {shop.followersCount} followers
            </span>
          )}
        </div>

        {/* Operating Hours */}
        {(shop.openTime || shop.closeTime) && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">
              Hours: {shop.openTime || "N/A"} - {shop.closeTime || "N/A"}
            </p>
          </div>
        )}
      </div>
    </Link>
  )
}

export default ShopCard
