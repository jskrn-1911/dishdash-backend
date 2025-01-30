import dotenv from 'dotenv';
import { uploadToCloudinary } from '../services/cloudinaryService.js';
import Admin from "../models/admin/admin.model.js";
import User from '../models/user/user.model.js';
import Driver from '../models/driver/driver.model.js';
import Kitchen from '../models/kitchen/kitchen.model.js';

dotenv.config();

const loginHandler = async (req, res) => {
    const { username, password } = req.body;
    // console.log("login request received: ", username, password)
    try {
        let admin = await Admin.findOne({ username }).select('+password');
        if (!admin) {
            return res.status(400).json({ message: 'invalid credentials or user not found' })
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'incorrect password' })
        }

        const token = await admin.generateAuthToken();

        res.cookie('token', token)

        res.status(200).json({ admin, token });
    } catch (error) {
        console.log('login user error', error);
        res.status(500).json({ message: 'server side login error' })
    }
}

const signupHandler = async (req, res) => {
    const { name, username, email, password, phoneNumber, role, gender, pin } = req.body;
    // console.log('signup admin request received', name, username, email, password, phoneNumber, role, gender, pin);
    if (pin !== process.env.ADMIN_CREATION_PIN) {
        return res.status(400).json({ message: 'invalid PIN number' });
    }

    try {
        let admin = await Admin.findOne({
            $or: [{ username }, { email }]
        });

        if (admin) {
            return res.status(400).json({ message: 'admin already exists' });
        }

        const files = req.files;
        let profileImageUrl = '';

        if (files && files.adminProfilePicture) {
            // console.log('received file:', files.adminProfilePicture);
            profileImageUrl = await uploadToCloudinary(
                files.adminProfilePicture[0],
                "adminProfilePictures"
            );
        } else {
            console.log('no file received for admin profile picture');
        }

        const hashedPassword = await Admin.hashPassword(password);

        admin = new Admin({
            name,
            username,
            email,
            password: hashedPassword,
            phoneNumber,
            role,
            gender,
            adminProfilePicture: profileImageUrl,
        });

        await admin.save();

        const token = admin.generateAuthToken();

        return res.status(201).json({ admin, token, message: 'admin registered successfully' });
    } catch (err) {
        console.error('register admin error:', err.message);
        res.status(500).json({ message: 'server side signup error' });
    }
};

const updateAdminProfile = async (req, res) => {
    const { username, email, password, role, gender, pin } = req.body;
    if (pin !== process.env.ADMIN_CREATION_PIN) {
        return res.status(400).json({ message: 'invalid PIN number' });
    }
    try {
        const adminToUpdate = await Admin.findOne({ username });
        if (!adminToUpdate) {
            return res.status(422).json({ message: `admin not found with username ${username}` });
        }

        const files = req.files;
        // let profileImageUrl = adminToUpdate.adminProfilePicture;

        if (files && files.adminProfilePicture) {
            adminToUpdate.adminProfilePicture = await uploadToCloudinary(
                files.adminProfilePicture[0],
                "adminProfilePictures"
            )
        };

        adminToUpdate.username = username;
        adminToUpdate.email = email;
        adminToUpdate.password = password;
        adminToUpdate.role = role;
        adminToUpdate.gender = gender;
        adminToUpdate.password = await Admin.hashPassword(password);

        await adminToUpdate.save();

        res.status(200).json({ message: `admin with username ${username} updated successfully`, admin: adminToUpdate });
    } catch (error) {
        console.error("Error updating admin:", error);
        res.status(500).json({ message: `error updating admin: ${error.message}` });
    }
};

const getAdminDetails = async (req, res) => {
    const { adminId } = req.params;

    try {
        const admin = await Admin.findById(adminId);

        if (!admin) {
            return res.status(422).json({
                message: `admin not found with adminID ${adminId} `,
                admin: {}
            })
        }

        if (admin) {
            return res.status(200).json({
                message: "admin details fetched successfully!",
                admin: admin,
            })
        }
    } catch (error) {
        console.error("error getting admin details from server", error.message);
        return res.status(500).json({
            message: "internal server error",
            error: error.message,
        });
    }
}

const changeAdminPassword = async (req, res) => {
    const { adminId, currentPassword, newPassword } = req.body;

    try {
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(422).json({
                message: `admin not found with adminId ${adminId}`,
                admin: {}
            })
        }

        const isMatch = admin.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: "entered current password does not matched with password, please enter correct password" })
        } else if (isMatch) {
            const newHashedPassword = await Admin.hashPassword(newPassword);
            admin.password = newHashedPassword;

            await admin.save();

            return res.status(200).json({
                message: `password changed successfully for adminId ${adminId}`,
                admin: admin,
            })
        }
    } catch (error) {
        console.error('error changing admin password:', error.message);
        res.status(500).json({ msg: 'server side error' });
    }
}

const getAllAdmins = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 10) * limit;

    try {
        const totalAdmins = await Admin.countDocuments();
        const admins = await Admin.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(totalAdmins / limit);

        return res.status(200).json({
            message: "admin fetched successfully!",
            admins: admins,
            totalPages,
            currentPage: page,
            totalAdmins,
        })
    } catch (error) {
        console.error('error fetching admins:', error.message);
        res.status(500).json({ message: 'internal server error' });
    }
}

// /api/admin/users?page=1&limit=10
const getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const users = await User.find()
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalUsers = await User.countDocuments();

        res.status(200).json({
            success: true,
            users: users,
            totalUsers: totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
        })
    } catch (error) {
        console.error("error fetching users")
        return res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}

// /api/admin/drivers?requestStatus=approved&page=1&limit=10
const getDrivers = async (req, res) => {
    try {
        const { status, requestStatus, page = 1, limit = 10 } = req.query;

        let filter = {};
        if (status) filter.status = status;
        if (requestStatus) filter.requestStatus = requestStatus;

        const drivers = await Driver.find(filter)
            .skip((page - 1) - limit)
            .limit(parseInt(limit));

        const totalDrivers = await Driver.countDocuments(filter);

        res.status(200).json({
            success: true,
            drivers: drivers,
            totalDrivers,
            totalPages: Math.ceil(totalDrivers / limit),
        })
    } catch (error) {
        console.error("error fetching drivers", error.message)
        return res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}

// /api/admin/kitchens?requestStatus=pending approval&page=1&limit=10
const getKitchens = async (req, res) => {
    try {
        const { status, requestStatus, page = 1, limit = 10 } = req.query;

        let filter = {};
        if (status) filter.status = status;
        if (requestStatus) filter.requestStatus = requestStatus;

        const kitchens = await Kitchen.find(filter)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalKitchens = await Kitchen.countDocuments(filter);

        return res.status(200).json({
            success: true,
            kitchens: kitchens,
            totalKitchens: totalKitchens,
            totalPages: Math.ceil(totalKitchens / limit),
        })
    } catch (error) {
        console.error("error fetching kitchens", error.message)
        return res.status(500).json({
            success: false,
            message: "internal server error",
        })
    }
}


export default {
    loginHandler,
    signupHandler,
    updateAdminProfile,
    getAdminDetails,
    changeAdminPassword,
    getAllAdmins,
    getUsers,
    getDrivers,
    getKitchens,
};