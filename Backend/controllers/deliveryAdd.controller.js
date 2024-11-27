import mongoose from 'mongoose';
import deliveryAdd from '../models/DeliveryAdd.model.js';

export const saveDeliveryAdd = async (req, res) => {
    const { fullName, phoneNumber, address, city, state, zipCode, userId } = req.body;

    // Validate input fields
    if (!fullName || !phoneNumber || !address || !city || !state || !zipCode) {
        return res.status(400).json({ message: 'Please fill out all the fields' });
    }

    try {
        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User Id' });
        }

        // Create a new delivery address entry
        const newDeliveryAddress = new deliveryAdd({
            userId,
            fullName,
            phoneNumber,
            address,
            city,
            state,
            zipCode,
        });

        // Save the delivery address to the database
        await newDeliveryAddress.save();

        // Respond with success message
        return res.status(201).json({ message: 'Delivery Address Saved Successfully!' });
    } catch (error) {
        console.error('Error saving delivery address:', error);
        return res.status(500).json({ message: 'Failed to save address' });
    }
};