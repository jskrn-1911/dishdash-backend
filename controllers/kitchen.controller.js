import dotenv from "dotenv";
import Kitchen from "../models/kitchen/kitchen.model.js";
import Wallet from "../models/wallet/wallet.model.js";
import { sendOTP, verifyOTP } from "../services/twilioService.js"
import { uploadToCloudinary } from "../services/cloudinaryService.js";

dotenv.config();

const sendKitchenOTP = async (req, res) => {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
        return res.status(400).json({ message: "phone number is required" });
    }

    try {
        const status = await sendOTP(phoneNumber);
        console.log("OTP sent", status);
        return res.status(200).json({ message: "OTP sent successfully" });

    } catch (error) {
        console.error("error sending OTP:", error);
        return res.status(500).json({ message: "failed to send OTP", error: error.message });
    }
}

const verifyKitchenOTP = async (req, res) => {
    const { phoneNumber, otp } = req.body;
    if (!phoneNumber || !otp) {
        return res.status(400).json({ message: "phone number and OTP are required" });
    }

    try {
        const status = await verifyOTP(phoneNumber, otp);

        if (status === 'approved') {
            let kitchen = await Kitchen.findOne({ phoneNumber });

            if (kitchen) {
                kitchen.isNewKitchen = false;
                const token = kitchen.generateAuthToken();

                return res.status(200).json({
                    message: "kitchen logged in successfully",
                    kitchen: kitchen,
                    token: token,
                });
            }

            // If kitchen does not exist, create new
            kitchen = new Kitchen({
                phoneNumber,
                isNewKitchen: true,
            });

            await kitchen.save();

            const wallet = new Wallet({
                kitchenId: kitchen._id,
                walletOf: 'kitchen'
            });
            await wallet.save();

            const token = kitchen.generateAuthToken();

            return res.status(201).json({
                message: "kitchen registered and logged in successfully",
                kitchen: kitchen,
                token: token,
            });
        } else {
            return res.status(400).json({ message: "invalid OTP" });
        }
    } catch (error) {
        console.error("error verifying OTP:", error);
        return res.status(500).json({ message: "failed to verify OTP", error: error.message });
    }
}

const loginSignupToken = async (req, res) => {
    const { phoneNumber } = req.body;
    console.log(req.body)
    console.log("working!", phoneNumber);
    if (!phoneNumber) {
        return res.status(400).json({ message: "phone number is required" });
    }
    try {
        let kitchen = await Kitchen.findOne({ phoneNumber });
        if (kitchen) {
            console.log("kitchen with phone number exists.");
            kitchen.isNewKitchen = false
            const newToken = kitchen.generateAuthToken();

            return res.status(200).json({
                message: "kitchen already exists so logged in successfully",
                kitchen: kitchen,
                token: newToken,
            });
        }

        // If kitchen does not exist, create a new one
        kitchen = new Kitchen({
            phoneNumber,
            location: {
                type: "Point",
                coordinates: [0, 0], // Default coordinates
            }
        });
        kitchen.isNewKitchen = true
        await kitchen.save();

        const wallet = new Wallet({
            kitchenId: kitchen._id,
            walletOf: 'kitchen'
        })
        await wallet.save();

        const newToken = kitchen.generateAuthToken();

        return res.status(201).json({
            message: "kitchen registered and logged in successfully",
            kitchen: kitchen,
            token: newToken,
        });
    } catch (error) {
        console.error("error in login signup", error.message);
        return res.status(500).json({
            message: "internal server error",
            error: error.message,
        });
    }
};

const getKitchenData = async (req, res) => {
    const { phoneNumber } = req.query;
    // console.log(req.query)
    try {
        const kitchen = await Kitchen.findOne({ phoneNumber });

        if (!kitchen) {
            return res.status(422).json({
                message: `kitchen not found with phone number ${phoneNumber} to update details`,
                kitchen: {}
            })
        }

        if (kitchen) {
            return res.status(200).json({
                message: "kitchen details fetched successfully!",
                kitchen: kitchen,
            })
        }
    } catch (error) {
        console.error("error getting kitchen data from server", error.message);
        return res.status(500).json({
            message: "internal server error",
            error: error.message,
        });
    }
}

const updateKitchenProfile = async (req, res) => {
    const { phoneNumber } = req.query;
    console.log(req.files)
    try {
        const kitchenToUpdate = await Kitchen.findOne({ phoneNumber });
        if (!kitchenToUpdate) {
            return res.status(422).json({
                message: `kitchen not found with phone number ${phoneNumber} to update details`
            })
        }

        const files = req.files;

        if (files?.kitchenProfilePhoto) {
            kitchenToUpdate.kitchenProfilePhoto = await uploadToCloudinary(files.kitchenProfilePhoto[0], "kitchenProfilePhotos");
        }

        if (files?.kitchenImages) {
            const uploadedImages = await Promise.all(
                files.kitchenImages.map(async (file) => {
                    return await uploadToCloudinary(file, "kitchenImages");
                })
            );
            kitchenToUpdate.kitchenImages = [...kitchenToUpdate.kitchenImages, ...uploadedImages];
        }

        Object.keys(req.body).forEach(key => {
            if (req.body[key] && key !== "phoneNumber") {
                kitchenToUpdate[key] = req.body[key];
            }
        });

        await kitchenToUpdate.save();

        res.status(200).json({
            message: `kitchen with phone number ${phoneNumber} updated successfully`,
            kitchen: kitchenToUpdate,
        });
    } catch (error) {
        console.error("Error updating kitchen details:", error);
        res.status(500).json({ message: `Error updating kitchen details: ${error.message}` });
    }
};


export default {
    sendKitchenOTP,
    verifyKitchenOTP,
    loginSignupToken,
    getKitchenData,
    updateKitchenProfile,
}