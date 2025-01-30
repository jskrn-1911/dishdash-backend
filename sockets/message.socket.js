import ChatLog from "../models/message/chatlog.model.js";
import Message from "../models/message/message.model.js";

export const messageSocketHandlers = (socket, io) => {
    console.log(`Socket ${socket.id} handling message events`);
    socket.on('joinChat', async ({ userId, driverId }) => {
        const roomId = `chat_${userId}_${driverId}`;
        socket.join(roomId);
        console.log(`User ${userId} and Driver ${driverId} joined messaging room ${roomId}`);
        try {
            await Message.updateMany({ roomId, messageBy: { $ne: userId ? 'user' : 'driver' }, read: false },
                { $set: { read: true }, $set: { readAt: Date.now() } }
            )
            io.to(roomId).emit('messagesRead', { roomId, readBy: userId ? 'user' : 'driver' });
        } catch (error) {
            console.log("Error marking messages as read:", error);
        }
    });

    socket.on('sendMessage', async ({ roomId, rideId, userId, driverId, messageBy, text }) => {
        const resolvedRoomId = roomId ? roomId : `chat_${userId}_${driverId}`
        try {
            const message = await Message.create({ roomId, rideId, userId, driverId, messageBy, text });
            io.to(roomId).emit('newMessage', message);

            await ChatLog.findOneAndUpdate(
                { roomId: resolvedRoomId },
                {
                    userId,
                    driverId,
                    rideId,
                    lastMessage: text,
                    lastMessageTimestamp: new Date()
                },
                { upsert: true, new: true }  // Create the entry if it doesn't exist
            );
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });
    socket.on('markAsRead', async ({ roomId, readBy }) => {
        try {
            await Message.updateMany({ roomId, messageBy: { $ne: readBy }, read: false },
                { $set: { read: true }, $set: { readAt: Date.now() } }
            )
            io.to(roomId).emit('messageRead', { roomId, readBy });
        } catch (error) {
            console.log("Error marking messages as read:", error);
        }
    })
}