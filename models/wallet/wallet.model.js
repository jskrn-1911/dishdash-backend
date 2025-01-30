import mongoose from 'mongoose';
import autoIncrement from 'mongoose-sequence';

const AutoIncrement = autoIncrement(mongoose);

const walletSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    kitchenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Kitchen',
    },
    balance: {
      type: Number,
      default: 0,
      required: true,
      min: [0, 'Balance cannot be negative'],
    },
    walletOf: {
      type: String,
      enum: ['driver', 'user', 'kitchen'],
      required: true,
      
  },
    walletIndex: { type: Number },
  },
  {
    timestamps: true,
  }
);

walletSchema.plugin(AutoIncrement, { inc_field: 'walletIndex' });
walletSchema.index({ driver: 1 });

const Wallet = mongoose.model('Wallet', walletSchema);

export default Wallet;
