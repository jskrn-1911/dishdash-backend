import Kitchen from "../models/kitchen/kitchen.model.js";

export const kitchenSocketHandler = (socket, io) => {
    console.log(`kitchen connected: ${socket.id}`);

    socket.on("kitchenConnected", async ({ kitchenId }) => {
        try {
            await Kitchen.findByIdAndUpdate(kitchenId, { socketId: socket.id });
            console.log(`kitchen socket ID updated: ${socket.id}`);
        } catch (error) {
            console.error("error updating kitchen socket ID:", error.message);
        }
    });

    socket.on("disconnect", () => {
        console.log(`kitchen disconnected: ${socket.id}`);
    });
};
