import mongoose from "mongoose";
import autoIncrement from 'mongoose-sequence';
import jwt from 'jsonwebtoken'
const AutoIncrement = autoIncrement(mongoose);

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, required: false }, // e.g., Home, Work, etc.
    addressLine1: { type: String, required: true },
    addressLine2: { type: String }, 
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
    // coordinates: {
    //   lat: { type: Number, required: true }, 
    //   lng: { type: Number, required: true }, 
    // },
  },
  {
    _id: false, 
    timestamps: false,
  }
);

const userSchema = new mongoose.Schema(
  {
    userIndex: { type: Number },
    phoneNumber: { type: Number, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    email: { type: String },
    profilePicture: { type: String },
    dateOfBirth: { type: Date },

    region: { type: String },

    addresses: [addressSchema],

    requestStatus: { type: Boolean, default: false },
    rewardPoints: { type: Number, default: 0 },
    feedbackCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    isNewUser: { type: Boolean },
    socketId: { type: String, required: false },
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallet',
      unique: true,
    },

    preferences: {
      notifications: { type: Boolean, default: true }, // Notification preference
      language: { type: String, default: 'en' }, // Preferred language
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ location: '2dsphere' });

userSchema.plugin(AutoIncrement, { inc_field: 'userIndex' });

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' });
  return token;
}

const User = mongoose.model("User", userSchema);

export default User;