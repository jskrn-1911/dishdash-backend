import mongoose from "mongoose";
import autoIncrement from 'mongoose-sequence';
const AutoIncrement = autoIncrement(mongoose);

const orderSchema = new mongoose.Schema({
    orderIndex: { type: Number },

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userPhoneNumber: { type: String, required: true },
    userEmail: { type: String, required: false },
    userFirstName: { type: String },
    userLastName: { type: String },

    kitchenId: { type: mongoose.Schema.Types.ObjectId, ref: "Kitchen", required: true },
    kitchenName: { type: String },
    kitchenOwnerName: { type: String },
    kitchenAdress: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String, default: "India" },
    },

    items: [{
        menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: ture },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        totalPrice: { type: Number },
    }],

    orderTotalPrice: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    grandTotal: { type: Number },
    specialInstructions: { type: String },

    deliveryAddress: {
        label: { type: String, required: true },
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        postalCode: { type: String, required: true },
        coordinates: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
        },
    },

    driverDetails: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
        phoneNumber: { type: String },
        email: { type: String },
        firstName: { type: String },
        lastName: { type: String },
        gender: { type: String },
        location: { type: Object },
    },
    rejectedByDrivers: [
        {
            driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
            rejectedAt: { type: Date, default: Date.now }
        }
    ],

    orderPlacedAt: { type: Date, default: Date.now },
    orderAcceptedAt: { type: Date },
    orderpreparedAt: { type: Date },
    orderDispatchedAt: { type: Date },
    orderDeliveredAt: { type: Date },
    orderCanceledAt: { type: Date },
    status: {
        type: String,
        enum: [
            "placed",
            "accepted",
            "preparing",
            "ready",
            "dispatched",
            "delivered",
            "canceled",
        ],
        default: "placed",
    },

    paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
    },
    paymentMethod: {
        type: String,
        enum: ["cash", "upi", "card"]
    },
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },

    cancelledBy: {
        type: String,
        enum: ["user", "kitchen"]
    },
    cancelReasons: {
        type: String,
        enum: [
            "Incorrect order details",
            "Food not required anymore",
            "Food quality concerns",
            "Late delivery",
            "Other reasons",
        ]
    }

},
    {
        timestamps: true,
    }
);

orderSchema.plugin(AutoIncrement, { inc_field: "orderIndex" });

const Order = mongoose.model("Order", orderSchema);

export default Order;