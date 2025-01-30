import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    roomId: { type: String, required: true }, 
    rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
    messageBy: { type: String, enum: ['user', 'driver'], required: true }, 
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
    readAt: { type: Date},
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
