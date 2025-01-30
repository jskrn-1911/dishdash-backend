import mongoose from "mongoose";
import autoIncrement from 'mongoose-sequence';
const AutoIncrement = autoIncrement(mongoose);

const rideSchema = new mongoose.Schema({
    rideIndex: { type: Number },
    startLocation: { type: Object },
    endLocation: { type: Object },
    startAddress: { type: String },
    endAddress: { type: String },

    rideBookedAt: { type: Date, default: Date.now },
    rideAcceptedAt: { type: Date },
    reachedUserAt: { type: Date },
    userPickedUpAt: { type: Date },
    rideStartedAt: { type: Date },
    reachedDestinationAt: { type: Date },
    paymentCompletedAt: { type: Date },
    userDroppedOffAt: { type: Date },

    userEmail: { type: String },
    userOrigin: {
        longitude: { type: Number, required: true },
        latitude: { type: Number, required: true },
    },
    userDestination: {
        longitude: { type: Number, required: true },
        latitude: { type: Number, required: true },
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userFirstName: { type: String },
    userLastName: { type: String },
    userPhoneNumber: { type: String },

    rejectedByDrivers: [
        {
            driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
            rejectedAt: { type: Date, default: Date.now } 
        }
    ],

    driverDetails: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
        phoneNumber: { type: String },
        email: { type: String },
        firstName: { type: String },
        lastName: { type: String },
        gender: { type: String },
        location: { type: Object },
    },

    durationInTraffic: { type: Object },
    distance: { type: Number, required: true },
    duration: { type: Number, required: true },
    pickupAddress: { type: String, required: true },
    dropAddress: { type: String, required: true },
    fares: { type: Number, required: true },
    extraDistance: { type: Number, default: 0 },
    waitingTime: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['requested', 'booked', 'accepted', 'pickedUp', 'started', 'completed', 'cancelled'],
        default: 'requested'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'notRecieved'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'upi', 'card']
    },
    // paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    cancelledBy: {
        type: String,
        enum: ['user', 'driver'],
    },
    cancelReasons: {
        type: String,
        enum: ['Safety concerns', 'Driver did not show up', 'Don not need ride anymore', 'Need to edit my ride details', 'Driver/Vehicle info did not match', 'Other reasons', 'User did not show up on time', 'I do not feel safe', 'Accidently accepted the ride', 'Vehicle problem']
    }
}, {
    timestamps: true
})

rideSchema.index({ location: '2dsphere' });
rideSchema.plugin(AutoIncrement, { inc_field: 'rideIndex' });

const Ride = mongoose.model("Ride", rideSchema);

export default Ride;