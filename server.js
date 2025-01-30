import fs from 'fs';
import dotenv from 'dotenv';
import { connectDB } from './db/db.js';
import { fileURLToPath } from 'url';
import * as path from 'path';
import express from "express";
import cors from "cors";
import http from 'http';
import https from 'https';
import bodyParser from "body-parser";
import adminRoutes from './routes/admin.routes.js';
import driverRoutes from './routes/driver.routes.js';
import userRoutes from './routes/user.routes.js';
import kitchenRoutes from './routes/kitchen.routes.js';
import { initializeSockets } from './socket.js';

dotenv.config();
connectDB();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var key = fs.readFileSync(path.join(__dirname, '/certs/private.key'));
var cert = fs.readFileSync(path.join(__dirname, 'certs/certificate.crt'));
const ca = fs.existsSync('/certs/certificate.csr') ? fs.readFileSync('/certs/certificate.csr', 'utf8') : null;
var options = {
    key: key,
    cert: cert,
    ca: ca ? ca : undefined,
};

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    credentials: true,
    // origin: process.env.DASHBOARD_URL,
    origin: "*",
}))
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));
app.use(express.static(path.join(__dirname, '/uploads')))
app.use(bodyParser.json());
// const server = http.createServer(app);
const server = https.createServer(options, app);

app.get('/', (req, res) => { res.send("IT'S WORKING!") })
app.use('/api/admin', adminRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/user', userRoutes);
app.use('/api/kitchen', kitchenRoutes);

// setupChangeStreams(); // setup change streams 

initializeSockets(server);

const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`Server is running on https://localhost:${port}`);
})




// uncomment if intialize socket is not working 
// export const io = new Server(server, {
//     cors: {
//         origin: '*',
//         methods: ['GET', 'POST', 'PUT', 'DELETE'],
//         allowedHeaders: ['Content-Type', 'Authorization'],
//     }
// });

// io.on('connection', (socket) => {
//     console.log(`Socket ${socket.id} connected`);

// });