import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded

    // Verify user still exists
    const user = await User.findById(decoded.userId)
    if (!user) {
      return res.status(401).json({ message: "Token is not valid" })
    }

    next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    res.status(401).json({ message: "Token is not valid" })
  }
}

export const ownerOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId)
    if (user.role !== "owner") {
      return res.status(403).json({ message: "Access denied. Owner role required." })
    }
    next()
  } catch (error) {
    console.error("Owner middleware error:", error)
    res.status(500).json({ message: "Server error" })
  }
}
