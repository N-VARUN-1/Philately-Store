import mongoose from 'mongoose';
const { Schema } = mongoose;

const adminSchema = new Schema({
    adminId : {
        type: String,
        unique: true,
        required: true
    },
    FullName: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    googleAuth: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});

const adminPortal = mongoose.model('adminPortal', adminSchema);

export default adminPortal;
