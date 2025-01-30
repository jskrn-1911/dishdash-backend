import dotenv from "dotenv";
import User from "../models/user/user.model.js";
import Wallet from "../models/wallet/wallet.model.js";
import { sendOTP, verifyOTP } from "../services/twilioService.js";
import { uploadToCloudinary } from "../services/cloudinaryService.js";

dotenv.config();

const sendUserOTP = async (req, res) => {
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

const verifyUserOTP = async (req, res) => {
    const { phoneNumber, otp } = req.body;
    if (!phoneNumber || !otp) {
        res.status(400).json({ message: "phone number and OTP are required" });
    }

    try {
        const status = await verifyOTP(phoneNumber, otp);

        if (status === 'approved') {
            let user = await User.findOne({ phoneNumber });

            if (user) {
                user.isNewUser = false;
                const token = user.generateAuthToken();

                return res.status(200).json({
                    message: "user logged in successfully",
                    user: user,
                    token: token,
                });
            }

            // If user does not exist, create new
            user = new User({ phoneNumber })
            user.firstName = ""
            user.lastName = ""
            user.gender = ""
            user.email = ""
            user.isNewUser = true
            await user.save();

            const wallet = new Wallet({
                userId: user._id,
                walletOf: 'user'
            });
            await wallet.save();

            const token = user.generateAuthToken();

            return res.status(201).json({
                message: "user registered and logged in successfully",
                user: user,
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
        let user = await User.findOne({ phoneNumber });
        if (user) {
            console.log("user with phone number exists.");
            user.isNewUser = false
            const newToken = user.generateAuthToken();

            return res.status(200).json({
                message: "user already exists so logged in successfully",
                user: user,
                token: newToken,
            });
        }

        // If user does not exist, create a new one
        user = new User({ phoneNumber })
        user.firstName = ""
        user.lastName = ""
        user.gender = ""
        user.email = ""
        user.isNewUser = true
        await user.save();

        const wallet = new Wallet({
            userId: user._id,
            walletOf: 'user'
        })
        await wallet.save();

        const newToken = user.generateAuthToken();

        return res.status(201).json({
            message: "user registered and logged in successfully",
            user: user,
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

const getUserDetails = async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        const user = await User.findOne({ phoneNumber });

        if (!user) {
            return res.status(422).json({
                message: `user not found with phone number ${phoneNumber} to update details`,
                user: {}
            })
        }

        if (user) {
            return res.status(200).json({
                message: "user details fetched successfully!",
                user: user,
            })
        }
    } catch (error) {
        console.error("error getting user data from server", error.message);
        return res.status(500).json({
            message: "internal server error",
            error: error.message,
        });
    }
}

const updateUserDetails = async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        const userToUpdate = await User.findOne({ phoneNumber })
        if (!userToUpdate) {
            return res.status(422).json({
                message: `user not found with phone number ${phoneNumber} to update details`
            })
        }

        const files = req.files;

        if (files?.userProfilePicture) {
            userToUpdate.profilePicture = await uploadToCloudinary(files.userProfilePicture[0], "userProfilePictures");
        }

        Object.keys(req.body).forEach((key) => {
            if (req.body[key] && key !== "phoneNumber") {
                userToUpdate[key] = req.body[key];
            }
        });

        await userToUpdate.save();

        res.status(200).json({
            message: `user with phone number ${phoneNumber} updated successfully`,
            user: userToUpdate,
        });

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: `Error updating user: ${error.message}` });
    }
}

export default {
    sendUserOTP,
    verifyUserOTP,
    loginSignupToken,
    getUserDetails,
    updateUserDetails,
}