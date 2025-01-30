import mongoose from 'mongoose';
import jwt from "jsonwebtoken";
import autoIncrement from 'mongoose-sequence';
const AutoIncrement = autoIncrement(mongoose);

const kitchenSchema = new mongoose.Schema({
  kitchenIndex: { type: Number },
  phoneNumber: { type: Number, required: true },
  name: { type: String, },
  ownerName: { type: String, },
  region: { type: String },
  address: {
    street: { type: String, },
    city: { type: String, },
    state: { type: String, },
    postalCode: { type: String, },
    country: { type: String, default: 'India' },
  },

  profilePhoto: { type: String }, 
  kitchenImages: [{ type: String }], 
  slogan: { type: String }, 
  description: { type: String },

  status: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline',
  },
  requestStatus: {
    type: String,
    enum: ['pending approval', 'approved', 'blocked', 'reject'],
    default: 'pending approval',
  },
  isNewKitchen: { type: Boolean },
  socketId: { type: String, required: false },
  menus: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

kitchenSchema.index({ location: '2dsphere' });
kitchenSchema.plugin(AutoIncrement, { inc_field: 'kitchenIndex' });

kitchenSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
  return token;
}

const Kitchen = mongoose.model("Kitchen", kitchenSchema);

export default Kitchen;