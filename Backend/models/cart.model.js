import mongoose from 'mongoose';
const { Schema } = mongoose;

const cartItemSchema = new mongoose.Schema({
    id: {
        type: Number, // Use ObjectId for references
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    name: String, // Optional
    price: Number, // Optional
    totalPrice: {
        type: Number,
        default: 0, // Default value
    },
    region: String, // Optional
    image: String, // Optional
});

// Pre-save middleware to calculate totalPrice
cartItemSchema.pre('save', function (next) {
    if (this.price && this.quantity) {
        this.totalPrice = this.price * this.quantity;
    }
    next();
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Use ObjectId for references
        ref: 'User',
        required: true,
    },
    items: [cartItemSchema],
});

export default mongoose.model('Cart', cartSchema);
