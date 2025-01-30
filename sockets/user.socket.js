import User from "../models/user/user.model.js";

export const userSocketHandler = (socket, io) => {
    console.log(`user connected: ${socket.id}`);

    socket.on("userConnected", async ({ userId }) => {
        try {
            await User.findByIdAndUpdate(userId, { socketId: socket.id });
            console.log(`user socket ID updated: ${socket.id}`);
        } catch (error) {
            console.error("error updating user socket ID:", error.message);
        }
    });

    socket.on("disconnect", () => {
        console.log(`user disconnected: ${socket.id}`);
    });
};
