import mongoose from 'mongoose';
import autoIncrement from 'mongoose-sequence';

const AutoIncrement = autoIncrement(mongoose);

const transactionSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: true,
      index: true,
    },
    rideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ride',
      // required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount must be positive'],
    },
    description: {
      type: String,
      required: true,
    },
    transactionIndex: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'rejected'],
      default: 'pending',
    },
    ApprovedBy:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    RejectedBy:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    }
  },
  {
    timestamps: true,
  }
);

transactionSchema.plugin(AutoIncrement, { inc_field: 'transactionIndex' });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
