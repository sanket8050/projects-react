import mongoose from "mongoose"

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    min: 0,
  },
  available: {
    type: Boolean,
    default: true,
  },
  notes: {
    type: String,
    trim: true,
  },
})

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["hotel", "mess", "stall", "restaurant", "shop"],
      required: true,
    },
    location: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
    },
    contact: {
      phone: {
        type: String,
        trim: true,
      },
      whatsapp: {
        type: String,
        trim: true,
      },
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    openTime: {
      type: String,
      trim: true,
    },
    closeTime: {
      type: String,
      trim: true,
    },
    todayMenu: [menuItemSchema],
    announcement: {
      type: String,
      trim: true,
    },
    followersCount: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Update lastUpdated on save
shopSchema.pre("save", function (next) {
  this.lastUpdated = new Date()
  next()
})

export default mongoose.model("Shop", shopSchema)
