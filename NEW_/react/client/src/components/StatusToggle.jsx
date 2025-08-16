"use client"

import { useState } from "react"

const StatusToggle = ({ isOpen, onToggle, disabled = false }) => {
  const [isToggling, setIsToggling] = useState(false)

  const handleToggle = async () => {
    if (disabled || isToggling) return

    setIsToggling(true)
    try {
      await onToggle(!isOpen)
    } finally {
      setIsToggling(false)
    }
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="text-right">
        <p className="text-sm font-medium text-gray-700">Shop Status</p>
        <p className={`text-sm ${isOpen ? "text-green-600" : "text-red-600"}`}>
          {isOpen ? "Currently Open" : "Currently Closed"}
        </p>
      </div>

      <button
        onClick={handleToggle}
        disabled={disabled || isToggling}
        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          isOpen ? "bg-green-500" : "bg-red-500"
        }`}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 ${
            isOpen ? "translate-x-7" : "translate-x-1"
          }`}
        >
          {isToggling && (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-3 w-3 border border-gray-400 border-t-transparent"></div>
            </div>
          )}
        </span>
      </button>

      <div className="text-left">
        <p className="text-sm font-medium text-gray-700">{isOpen ? "Open" : "Closed"}</p>
        <p className="text-xs text-gray-500">Click to {isOpen ? "close" : "open"}</p>
      </div>
    </div>
  )
}

export default StatusToggle
