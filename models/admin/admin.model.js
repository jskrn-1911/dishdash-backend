import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: [ 3, 'name must be at least 3 characters long' ], },
    username: { type: String, required: true, minlength: [ 3, 'username must be at least 3 characters long' ], },
    email: { type: String, unique: true, required: true, lowercase: true, match: [ /^\S+@\S+\.\S+$/, 'Please enter a valid email' ] },
    password: { type: String, required: true, select: false, },
    phoneNumber: { type: String },
    role: { 
        type: String, 
        required: true, 
        enum: ['admin', 'superadmin', 'moderator'], 
        default: 'admin' 
    },
    gender: { 
        type: String,  
        enum: ['male', 'female', 'other'], 
        
    },
    
    adminProfilePicture: { type: String },
}, {
    timestamps: true
});

adminSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}

adminSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

adminSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
}

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
