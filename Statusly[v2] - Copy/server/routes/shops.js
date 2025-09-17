// AI: Shop routes for CRUD operations, geolocation queries, and real-time updates
import express from 'express';
import jwt from 'jsonwebtoken';
import Shop from '../models/Shop.js';
import User from '../models/User.js';

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Middleware to check if user is shop owner
const requireOwner = async (req, res, next) => {
  if (req.user.role !== 'owner') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Owner role required.'
    });
  }
  next();
};

// Get nearby shops with filters
router.get('/', async (req, res) => {
  try {
    const { lat, lng, radius = 10, q, type } = req.query;

    let query = {};

    // Add location filter if coordinates provided
    if (lat && lng) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      const radiusNum = parseFloat(radius);

      query['location.lat'] = {
        $gte: latNum - (radiusNum / 111),
        $lte: latNum + (radiusNum / 111)
      };
      query['location.lng'] = {
        $gte: lngNum - (radiusNum / (111 * Math.cos(latNum * Math.PI / 180))),
        $lte: lngNum + (radiusNum / (111 * Math.cos(latNum * Math.PI / 180)))
      };
    }

    // Add type filter
    if (type && type !== 'all') {
      query.type = type;
    }

    // Add text search
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { 'todayMenu.name': { $regex: q, $options: 'i' } }
      ];
    }

    const shops = await Shop.find(query)
      .populate('ownerId', 'name email')
      .sort({ lastUpdated: -1 })
      .limit(50);

    // Calculate distances if coordinates provided
    if (lat && lng) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      
      shops.forEach(shop => {
        shop.distance = shop.calculateDistance(latNum, lngNum);
      });

      // Sort by distance
      shops.sort((a, b) => a.distance - b.distance);
    }

    res.json({
      success: true,
      data: shops,
      count: shops.length
    });

  } catch (error) {
    console.error('Get shops error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shops'
    });
  }
});

// Get shop by ID
router.get('/:id', async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id)
      .populate('ownerId', 'name email');

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    res.json({
      success: true,
      data: shop
    });

  } catch (error) {
    console.error('Get shop error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shop'
    });
  }
});

// Create new shop (owner only)
router.post('/', authenticateToken, requireOwner, async (req, res) => {
  try {
    const {
      name,
      type,
      location,
      contact,
      openTime,
      closeTime
    } = req.body;

    // Check if user already has a shop
    const existingShop = await Shop.findOne({ ownerId: req.user._id });
    if (existingShop) {
      return res.status(400).json({
        success: false,
        message: 'You already have a shop registered'
      });
    }

    const shop = new Shop({
      name,
      type,
      ownerId: req.user._id,
      location,
      contact,
      openTime,
      closeTime
    });

    await shop.save();

    // Emit socket event for new shop
    req.app.get('io').emit('shopCreated', shop);

    res.status(201).json({
      success: true,
      message: 'Shop created successfully',
      data: shop
    });

  } catch (error) {
    console.error('Create shop error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create shop'
    });
  }
});

// Update shop (owner only)
router.put('/:id', authenticateToken, requireOwner, async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    // Check if user owns this shop
    if (shop.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own shop.'
      });
    }

    const updatedShop = await Shop.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdated: new Date() },
      { new: true, runValidators: true }
    ).populate('ownerId', 'name email');

    // Emit socket event for shop update
    req.app.get('io').emit('shopUpdated', updatedShop);

    res.json({
      success: true,
      message: 'Shop updated successfully',
      data: updatedShop
    });

  } catch (error) {
    console.error('Update shop error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update shop'
    });
  }
});

// Update shop status (owner only)
router.put('/:id/status', authenticateToken, requireOwner, async (req, res) => {
  try {
    const { isOpen } = req.body;
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    if (shop.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    shop.isOpen = isOpen;
    shop.lastUpdated = new Date();
    await shop.save();

    const updatedShop = await Shop.findById(req.params.id)
      .populate('ownerId', 'name email');

    // Emit socket event
    req.app.get('io').emit('shopUpdated', updatedShop);

    res.json({
      success: true,
      message: `Shop is now ${isOpen ? 'open' : 'closed'}`,
      data: updatedShop
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status'
    });
  }
});

// Update shop menu (owner only)
router.put('/:id/menu', authenticateToken, requireOwner, async (req, res) => {
  try {
    const { todayMenu } = req.body;
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    if (shop.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    shop.todayMenu = todayMenu;
    shop.lastUpdated = new Date();
    await shop.save();

    const updatedShop = await Shop.findById(req.params.id)
      .populate('ownerId', 'name email');

    // Emit socket event
    req.app.get('io').emit('shopUpdated', updatedShop);

    res.json({
      success: true,
      message: 'Menu updated successfully',
      data: updatedShop
    });

  } catch (error) {
    console.error('Update menu error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update menu'
    });
  }
});

// Update shop announcement (owner only)
router.put('/:id/announcement', authenticateToken, requireOwner, async (req, res) => {
  try {
    const { announcement } = req.body;
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    if (shop.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    shop.announcement = announcement;
    shop.lastUpdated = new Date();
    await shop.save();

    const updatedShop = await Shop.findById(req.params.id)
      .populate('ownerId', 'name email');

    // Emit socket event
    req.app.get('io').emit('shopUpdated', updatedShop);

    res.json({
      success: true,
      message: 'Announcement updated successfully',
      data: updatedShop
    });

  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update announcement'
    });
  }
});

export default router;
