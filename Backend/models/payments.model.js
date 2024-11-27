import mongoose from "mongoose";
import { Schema } from "mongoose";

const paySchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    cardNumber: {
        type: String,
        required: true,
        unique: true,
    },
    expDate: {
        type: String,
        required: true
    },
    cvv: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Use ObjectId for references
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number, 
        required: true
    },
    orderId:{
        type: String,
        required: true
    },
    date: {
        type: String,
        default: Date.now, // Automatically set the date to the current date/time when the payment is created
    },
})

export default mongoose.model('Payment', paySchema);