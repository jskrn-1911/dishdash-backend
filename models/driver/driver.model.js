import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import autoIncrement from 'mongoose-sequence';
const AutoIncrement = autoIncrement(mongoose);

const driverSchema = new mongoose.Schema({
    driverIndex: { type: Number },
    phoneNumber: { type: Number, required: true },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    email: { type: String },
    gender: {
        type: String,
        enum: ['men', 'women', 'other']
    },
    profilePicture: { type: String },
    address: { type: String },

    requestStatus: {
        type: String,
        enum: ['pending approval', 'approved', 'blocked', 'reject'],
        default: 'pending approval',

    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline'
    },

    vehicleImage: { type: String },
    vehicleType: { type: String },
    vehiclePlate: { type: String },
    vehiclePlatePicture: { type: String },
    vehicleModel: { type: String },
    vehicleColor: { type: String },
    vehicleProductionYear: { type: String },
    vehicleRegistrationCard: { type: String },
    vehiclePollutionCertificate: { type: String },
    vehicleInsurancePicture: { type: String },

    bankName: { type: String },
    bankAccountNumber: { type: String },
    ifscNumber: { type: String },

    adharCardPicture: { type: String },
    panCardPicture: { type: String },

    totalEarnings: { type: Number, default: 0 },
    feedbackCount: { type: Number, default: 0 },
    isNewDriver: { type: Boolean },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] },
    },
    isAvailable: { type: Boolean, default: true },
    socketId: { type: String, required: false },
    walletId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet',
        unique: true,
    },
}, {
    timestamps: true
});

driverSchema.index({ location: '2dsphere' });
driverSchema.plugin(AutoIncrement, { inc_field: 'driverIndex' });

driverSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}

const Driver = mongoose.model("Driver", driverSchema);

export default Driver;
