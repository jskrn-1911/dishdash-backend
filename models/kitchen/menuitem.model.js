const menuItemSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ['starter', 'main course', 'dessert', 'beverage', 'other'],
    },
    image: {
      type: String, // Cloudinary or S3 image URL
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    menu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  export const MenuItem = mongoose.model('MenuItem', menuItemSchema);
  