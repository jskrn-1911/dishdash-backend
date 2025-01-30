import { Server } from "socket.io";
import { userSocketHandler } from "./sockets/user.socket.js";
import { driverSocketHandler } from "./sockets/driver.socket.js";
import { messageSocketHandlers } from "./sockets/message.socket.js";
import { kitchenSocketHandler } from "./sockets/kitchen.socket.js";

export const initializeSockets = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        }
    });

    io.on('connection', (socket) => {
        console.log(`socket ${socket.id} connected`);
        
        userSocketHandler(socket, io);    // handle user events
        driverSocketHandler(socket, io);  // handle driver events
        kitchenSocketHandler(socket, io);  // handle kitchen events
        messageSocketHandlers(socket, io); // handle message events
        // rideSocketHandler(socket, io);    // handle ride or order events

        socket.on('disconnect', () => {
            console.log(`socket ${socket.id} disconnected`);
        });
    });

    return io; 
};