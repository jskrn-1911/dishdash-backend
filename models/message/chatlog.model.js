import mongoose from "mongoose";

const chatLogSchema = new mongoose.Schema({
    roomId: {type: String, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    driverId: {type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true},
    rideId: {type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true},
    lastMessage: {type: String},
    lastMesageTimestamp: {type: Date},
}, {timestamps: true});

const ChatLog = mongoose.model('ChatLog', chatLogSchema);

export default ChatLog;