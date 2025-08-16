"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { io } from "socket.io-client"

const SocketContext = createContext()

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider")
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000"

    // Initialize socket connection
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      timeout: 20000,
    })

    // Connection event handlers
    newSocket.on("connect", () => {
      console.log("Connected to server:", newSocket.id)
      setConnected(true)
    })

    newSocket.on("disconnect", (reason) => {
      console.log("Disconnected from server:", reason)
      setConnected(false)
    })

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error)
      setConnected(false)
    })

    setSocket(newSocket)

    // Cleanup on unmount
    return () => {
      newSocket.close()
    }
  }, [])

  // Socket utility functions
  const joinShop = (shopId) => {
    if (socket && connected) {
      socket.emit("joinShop", shopId)
    }
  }

  const leaveShop = (shopId) => {
    if (socket && connected) {
      socket.emit("leaveShop", shopId)
    }
  }

  const onShopUpdated = (callback) => {
    if (socket) {
      socket.on("shopUpdated", callback)
      return () => socket.off("shopUpdated", callback)
    }
  }

  const onShopDetailsUpdated = (callback) => {
    if (socket) {
      socket.on("shopDetailsUpdated", callback)
      return () => socket.off("shopDetailsUpdated", callback)
    }
  }

  const onShopCreated = (callback) => {
    if (socket) {
      socket.on("shopCreated", callback)
      return () => socket.off("shopCreated", callback)
    }
  }

  const onShopDeleted = (callback) => {
    if (socket) {
      socket.on("shopDeleted", callback)
      return () => socket.off("shopDeleted", callback)
    }
  }

  const value = {
    socket,
    connected,
    joinShop,
    leaveShop,
    onShopUpdated,
    onShopDetailsUpdated,
    onShopCreated,
    onShopDeleted,
  }

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}
