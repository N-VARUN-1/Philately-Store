import mongoose from "mongoose";
import { Schema } from "mongoose";

const deliverySchema = new Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User ', 
        required: true 
    },
    fullName: {
        type: String,
        required: true, 
    },
    phoneNo: {
        type: Number,
        requred: true
    },
    address: {
        type: String,
        requred: true
    },
    city: {
        type: String,
        requred: true
    },
    state: {
        type: String,
        requred: true
    },
    zipCode: {
        type: Number,
        requred: true
    },
}, { timestamps: true })

const deliveryAdd = mongoose.model("deliveryScema ", deliverySchema);
export default deliveryAdd;