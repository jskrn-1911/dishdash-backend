const menuSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    kitchen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Kitchen',
      required: true,
    },
    menuItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
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
  
  export const Menu = mongoose.model('Menu', menuSchema);
  