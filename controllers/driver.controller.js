import dotenv from "dotenv";
import Driver from "../models/driver/driver.model.js";
import Wallet from "../models/wallet/wallet.model.js";
import { sendOTP, verifyOTP } from "../services/twilioService.js";

dotenv.config();

const sendDriverOTP = async (req, res) => {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
        res.status(400).json({ message: "phone number is required" });
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

const verifyDriverOTP = async (req, res) => {
    const { phoneNumber, otp } = req.body;
    if (!phoneNumber || !otp) {
        res.status(400).json({ message: "phone number and OTP are required" });
    }

    try {
        const status = await verifyOTP(phoneNumber, otp);

        if (status === 'approved') {
            let driver = await Driver.findOne({ phoneNumber });

            if (driver) {
                driver.isNewDriver = false;
                const token = driver.generateAuthToken();

                return res.status(200).json({
                    message: "driver logged in successfully",
                    driver: driver,
                    token: token,
                });
            }

            // If driver does not exist, create new
            driver = new Driver({
                phoneNumber,
                location: {
                    type: "Point",
                    coordinates: [0, 0],
                },
                isNewDriver: true,
            });

            await driver.save();

            const wallet = new Wallet({
                driverId: driver._id,
                walletOf: 'driver'
            });
            await wallet.save();

            const token = driver.generateAuthToken();

            return res.status(201).json({
                message: "driver registered and logged in successfully",
                driver: driver,
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

    try {
        let driver = await Driver.findOne({ phoneNumber });
        if (driver) {
            console.log("driver with phone number exists.");
            driver.isNewDriver = false
            const newToken = driver.generateAuthToken();

            return res.status(200).json({
                message: "driver already exists so logged in successfully",
                driver: driver,
                token: newToken,
            });
        }

        // If user does not exist, create a new one
        driver = new Driver({
            phoneNumber,
            location: {
                type: "Point",
                coordinates: [0, 0], // Default coordinates
            }
        });
        driver.isNewDriver = true
        await driver.save();

        const wallet = new Wallet({
            driverId: driver._id,
            walletOf: 'driver'
        })
        await wallet.save();

        const newToken = driver.generateAuthToken();

        return res.status(201).json({
            message: "driver registered and logged in successfully",
            driver: driver,
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

const getDriverDetails = async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        const driver = await Driver.findOne({ phoneNumber });

        if (!driver) {
            return res.status(422).json({
                message: `driver not found with phone number ${phoneNumber} to update details`,
                driver: {}
            })
        }

        if (driver) {
            return res.status(200).json({
                message: "driver details fetched successfully!",
                driver: driver,
            })
        }
    } catch (error) {
        console.error("error getting driver data from server", error.message);
        return res.status(500).json({
            message: "internal server error",
            error: error.message,
        });
    }
}

const updateDriverDetails = async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        const driverToUpdate = await Driver.findOne({ phoneNumber })
        if (!driverToUpdate) {
            return res.status(422).json({
                message: `driver not found with phone number ${phoneNumber} to update details`
            })
        }

        Object.keys(req.body).forEach((key) => {
            if (req.body[key] && key !== "phoneNumber") {
                driverToUpdate[key] = req.body[key];
            }
        })

        const files = req.files;
        const fileFields = [
            "driverProfilePicture",
            "vehicleImage",
            "vehiclePlatePicture",
            "vehicleRegistrationCard",
            "vehiclePollutionCertificate",
            "vehicleInsurancePicture",
            "adharCardPicture",
            "panCardPicture",
        ];

        for (const field of fileFields) {
            if (files && files[field]) {
                driverToUpdate[field] = await uploadToCloudinary(
                    files[field][0],
                    `driver-${field}`
                );
            }
        }

        await driverToUpdate.save();

        res.status(200).json({
            message: `driver with phone number ${phoneNumber} updated successfully`,
            driver: driverToUpdate,
        });

    } catch (error) {
        console.error("Error updating driver:", error);
        res.status(500).json({ message: `Error updating driver: ${error.message}` });
    }
}

export default {
    sendDriverOTP,
    verifyDriverOTP,
    loginSignupToken,
    getDriverDetails,
    updateDriverDetails
}