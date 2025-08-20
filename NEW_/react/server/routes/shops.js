import express from "express"
import Shop from "../models/Shop.js"
import { authMiddleware, ownerOnly } from "../middleware/auth.js"
import { calculateDistance } from "../utils/helpers.js"

const router = express.Router()

// @route   GET /api/shops
// @desc    Get nearby shops with filters
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { lat, lng, q, radius = 10, type } = req.query

    // Build query object
    const query = {}

    // Filter by type if provided
    if (type && type !== "all") {
      query.type = type
    }

    // Text search in name, announcement, or menu items
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { announcement: { $regex: q, $options: "i" } },
        { "todayMenu.name": { $regex: q, $options: "i" } },
      ]
    }

    // Get all shops matching the query
    const shops = await Shop.find(query).populate("ownerId", "name email").lean()

    // If location provided, calculate distances and filter by radius
    let filteredShops = shops
    if (lat && lng) {
      const userLat = Number.parseFloat(lat)
      const userLng = Number.parseFloat(lng)
      const maxRadius = Number.parseFloat(radius)

      filteredShops = shops
        .map((shop) => {
          const distance = calculateDistance(userLat, userLng, shop.location.lat, shop.location.lng)
          return { ...shop, distance }
        })
        .filter((shop) => shop.distance <= maxRadius)
        .sort((a, b) => a.distance - b.distance)
    }

    // Format response
    const formattedShops = filteredShops.map((shop) => ({
      id: shop._id,
      name: shop.name,
      type: shop.type,
      location: shop.location,
      contact: shop.contact,
      isOpen: shop.isOpen,
      openTime: shop.openTime,
      closeTime: shop.closeTime,
      announcement: shop.announcement,
      followersCount: shop.followersCount,
      lastUpdated: shop.lastUpdated,
      distance: shop.distance || null,
      // Only show first 3 menu items for list view
      todayMenu: shop.todayMenu.slice(0, 3),
      owner: shop.ownerId ? { name: shop.ownerId.name } : null,
    }))

    res.json({
      shops: formattedShops,
      total: formattedShops.length,
    })
  } catch (error) {
    console.error("Get shops error:", error)
    res.status(500).json({ message: "Server error while fetching shops" })
  }
})

// @route   GET /api/shops/:id
// @desc    Get shop details
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate("ownerId", "name email phone")

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" })
    }

    // Format response with full details
    const shopData = {
      id: shop._id,
      name: shop.name,
      type: shop.type,
      location: shop.location,
      contact: shop.contact,
      isOpen: shop.isOpen,
      openTime: shop.openTime,
      closeTime: shop.closeTime,
      todayMenu: shop.todayMenu,
      announcement: shop.announcement,
      followersCount: shop.followersCount,
      lastUpdated: shop.lastUpdated,
      createdAt: shop.createdAt,
      owner: shop.ownerId
        ? {
            name: shop.ownerId.name,
            email: shop.ownerId.email,
            phone: shop.ownerId.phone,
          }
        : null,
    }

    res.json(shopData)
  } catch (error) {
    console.error("Get shop details error:", error)
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid shop ID" })
    }
    res.status(500).json({ message: "Server error while fetching shop details" })
  }
})

// @route   POST /api/shops
// @desc    Create new shop
// @access  Private (Owner only)
router.post("/", authMiddleware, ownerOnly, async (req, res) => {
  try {
    const { name, type, location, contact, openTime, closeTime, todayMenu, announcement } = req.body

    // Validation
    if (!name || !type || !location || !location.lat || !location.lng || !location.address) {
      return res.status(400).json({ message: "Please provide all required fields" })
    }

    // Check if owner already has a shop
    const existingShop = await Shop.findOne({ ownerId: req.user.userId })
    if (existingShop) {
      return res.status(400).json({ message: "You already have a shop registered" })
    }

    // Create new shop
    const shop = new Shop({
      name,
      ownerId: req.user.userId,
      type,
      location,
      contact: contact || {},
      openTime,
      closeTime,
      todayMenu: todayMenu || [],
      announcement,
      isOpen: false, // Default to closed
    })

    await shop.save()

    // Populate owner data for response
    await shop.populate("ownerId", "name email")

    // Emit real-time update
    req.io.emit("shopCreated", {
      id: shop._id,
      name: shop.name,
      type: shop.type,
      location: shop.location,
      isOpen: shop.isOpen,
    })

    res.status(201).json({
      message: "Shop created successfully",
      shop: {
        id: shop._id,
        name: shop.name,
        type: shop.type,
        location: shop.location,
        contact: shop.contact,
        isOpen: shop.isOpen,
        openTime: shop.openTime,
        closeTime: shop.closeTime,
        todayMenu: shop.todayMenu,
        announcement: shop.announcement,
        followersCount: shop.followersCount,
        lastUpdated: shop.lastUpdated,
        owner: { name: shop.ownerId.name },
      },
    })
  } catch (error) {
    console.error("Create shop error:", error)
    res.status(500).json({ message: "Server error while creating shop" })
  }
})

// @route   PUT /api/shops/:id
// @desc    Update shop
// @access  Private (Owner only)
router.put("/:id", authMiddleware, ownerOnly, async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id)

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" })
    }

    // Check if user owns this shop
    if (shop.ownerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to update this shop" })
    }

    // Update fields
    const { name, type, location, contact, isOpen, openTime, closeTime, todayMenu, announcement } = req.body

    if (name !== undefined) shop.name = name
    if (type !== undefined) shop.type = type
    if (location !== undefined) shop.location = location
    if (contact !== undefined) shop.contact = contact
    if (isOpen !== undefined) shop.isOpen = isOpen
    if (openTime !== undefined) shop.openTime = openTime
    if (closeTime !== undefined) shop.closeTime = closeTime
    if (todayMenu !== undefined) shop.todayMenu = todayMenu
    if (announcement !== undefined) shop.announcement = announcement

    await shop.save()

    // Populate owner data
    await shop.populate("ownerId", "name email")

    // Emit real-time update to all clients
    req.io.emit("shopUpdated", {
      id: shop._id,
      name: shop.name,
      type: shop.type,
      location: shop.location,
      isOpen: shop.isOpen,
      todayMenu: shop.todayMenu,
      announcement: shop.announcement,
      lastUpdated: shop.lastUpdated,
    })

    // Emit to specific shop room
    req.io.to(`shop_${shop._id}`).emit("shopDetailsUpdated", {
      id: shop._id,
      name: shop.name,
      type: shop.type,
      location: shop.location,
      contact: shop.contact,
      isOpen: shop.isOpen,
      openTime: shop.openTime,
      closeTime: shop.closeTime,
      todayMenu: shop.todayMenu,
      announcement: shop.announcement,
      lastUpdated: shop.lastUpdated,
    })

    res.json({
      message: "Shop updated successfully",
      shop: {
        id: shop._id,
        name: shop.name,
        type: shop.type,
        location: shop.location,
        contact: shop.contact,
        isOpen: shop.isOpen,
        openTime: shop.openTime,
        closeTime: shop.closeTime,
        todayMenu: shop.todayMenu,
        announcement: shop.announcement,
        followersCount: shop.followersCount,
        lastUpdated: shop.lastUpdated,
        owner: { name: shop.ownerId.name },
      },
    })
  } catch (error) {
    console.error("Update shop error:", error)
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid shop ID" })
    }
    res.status(500).json({ message: "Server error while updating shop" })
  }
})

// @route   DELETE /api/shops/:id
// @desc    Delete shop
// @access  Private (Owner only)
router.delete("/:id", authMiddleware, ownerOnly, async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id)

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" })
    }

    // Check if user owns this shop
    if (shop.ownerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to delete this shop" })
    }

    await Shop.findByIdAndDelete(req.params.id)

    // Emit real-time update
    req.io.emit("shopDeleted", { id: shop._id })

    res.json({ message: "Shop deleted successfully" })
  } catch (error) {
    console.error("Delete shop error:", error)
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid shop ID" })
    }
    res.status(500).json({ message: "Server error while deleting shop" })
  }
})

// @route   GET /api/shops/owner/my-shop
// @desc    Get owner's shop
// @access  Private (Owner only)
router.get("/owner/my-shop", authMiddleware, ownerOnly, async (req, res) => {
  try {
    const shop = await Shop.findOne({ ownerId: req.user.userId }).populate("ownerId", "name email phone")

    if (!shop) {
      return res.status(404).json({ message: "No shop found for this owner" })
    }

    res.json({
      id: shop._id,
      name: shop.name,
      type: shop.type,
      location: shop.location,
      contact: shop.contact,
      isOpen: shop.isOpen,
      openTime: shop.openTime,
      closeTime: shop.closeTime,
      todayMenu: shop.todayMenu,
      announcement: shop.announcement,
      followersCount: shop.followersCount,
      lastUpdated: shop.lastUpdated,
      createdAt: shop.createdAt,
      owner: {
        name: shop.ownerId.name,
        email: shop.ownerId.email,
        phone: shop.ownerId.phone,
      },
    })
  } catch (error) {
    console.error("Get owner shop error:", error)
    res.status(500).json({ message: "Server error while fetching shop" })
  }
})

export default router
