// AI: Shop model for MongoDB with location, menu, and real-time status
import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  price: {
    type: Number,
    min: [0, 'Price cannot be negative']
  },
  available: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    trim: true
  }
});

const locationSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: [true, 'Latitude is required'],
    min: -90,
    max: 90
  },
  lng: {
    type: Number,
    required: [true, 'Longitude is required'],
    min: -180,
    max: 180
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  }
});

const contactSchema = new mongoose.Schema({
  phone: {
    type: String,
    trim: true
  },
  whatsapp: {
    type: String,
    trim: true
  }
});

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Shop name is required'],
    trim: true,
    minlength: [2, 'Shop name must be at least 2 characters long']
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner ID is required']
  },
  type: {
    type: String,
    enum: ['hotel', 'mess', 'stall', 'restaurant', 'shop'],
    required: [true, 'Shop type is required']
  },
  location: {
    type: locationSchema,
    required: [true, 'Location is required']
  },
  contact: {
    type: contactSchema,
    default: {}
  },
  isOpen: {
    type: Boolean,
    default: false
  },
  openTime: {
    type: String,
    trim: true
  },
  closeTime: {
    type: String,
    trim: true
  },
  todayMenu: [{
    type: menuItemSchema,
    default: []
  }],
  announcement: {
    type: String,
    trim: true
  },
  followersCount: {
    type: Number,
    default: 0,
    min: [0, 'Followers count cannot be negative']
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for geospatial queries
shopSchema.index({ 'location.lat': 1, 'location.lng': 1 });

// Index for text search
shopSchema.index({ 
  name: 'text', 
  'todayMenu.name': 'text',
  type: 1 
});

// Update lastUpdated timestamp on save
shopSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Static method to find nearby shops
shopSchema.statics.findNearby = function(lat, lng, radius = 10) {
  return this.find({
    'location.lat': {
      $gte: lat - (radius / 111), // Approximate degrees per km
      $lte: lat + (radius / 111)
    },
    'location.lng': {
      $gte: lng - (radius / (111 * Math.cos(lat * Math.PI / 180))),
      $lte: lng + (radius / (111 * Math.cos(lat * Math.PI / 180)))
    }
  }).populate('ownerId', 'name email');
};

// Instance method to calculate distance
shopSchema.methods.calculateDistance = function(lat, lng) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat - this.location.lat) * Math.PI / 180;
  const dLng = (lng - this.location.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(this.location.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const Shop = mongoose.model('Shop', shopSchema);

export default Shop;
