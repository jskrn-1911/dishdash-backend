import Driver from "../models/driver/driver.model.js";

export const driverSocketHandler = (socket, io) => {
    console.log(`driver connected: ${socket.id}`);

    socket.on("driverConnected", async ({ driverId }) => {
        try {
            const driver = await Driver.findById(driverId);
            if (!driver) {
                console.error("driver not found");
                return;
            }

            // update driver with the new unique socket ID and set status to online and is_available to true
            driver.isAvailable = true;
            driver.status = "online";
            driver.socketId = socket.id;
            await driver.save();

            console.log(`driver socket ID updated for driver ${driverId}: ${socket.id}`);
        } catch (err) {
            console.error("error updating driver socket ID:", err);
        }
    });

    socket.on("disconnect", async () => {
        try {
            console.log(`driver disconnected: ${socket.id}`);

            // find and remove the socket ID for the driver when they disconnect
            const driver = await Driver.findOne({ socketId: socket.id });

            if (driver) {
                driver.socketId = null;  // remove socket ID upon disconnect
                driver.isAvailable = false;
                driver.status = "offline";
                await driver.save();
            }
        } catch (err) {
            console.error("error handling driver disconnect:", err);
        }
    });
};
