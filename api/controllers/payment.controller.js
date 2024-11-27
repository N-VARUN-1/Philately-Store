
import mongoose from 'mongoose';
import Payment from '../models/payments.model.js';
import transporter from '../nodemailer/mailer.js';
import Cart from '../models/cart.model.js';

import 'dotenv';


export const savePayments = async (req, res) => {
    const { fullName, cardNumber, expDate, cvv, paymentMethod, amount, userId, date, email } = req.body;

    try {
        // Validate userId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid userId format.' });
        }

        // Check for items in cart
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'No items in cart' });
        }

        // Generate a unique order ID
        const generateOrderId = () => {
            const randomId = Math.floor(Math.random() * 1000000000);
            return `#${randomId}`;
        };

        const paymentDate = date ? new Date(date) : new Date();

        const newPayment = new Payment({ fullName, cardNumber, expDate, cvv, paymentMethod, amount, userId, orderId: generateOrderId(), date: new Date() });
        await newPayment.save();

        // Create HTML for cart items
        const cartItemsHTML = cart.items.map(item => `
            <tr>
                <td>${item.name || 'Product'}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>₹${(item.quantity * item.price).toFixed(2)}</td>
            </tr>
        `).join('');

        const mailOptions = {
            from: process.env.VITE_USER_EMAIL,
            to: email,
            subject: `Your Receipt for Order ${newPayment.orderId}`,
            html: `
                <html>
                <body>
                    <h2>Thank you for Ordering from Philately Store!</h2>
                    <p>Order Details:</p>
                    <table border="1" cellpadding="5" cellspacing="0">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${cartItemsHTML}
                        </tbody>
                    </table>
                    <p>Total Amount: ₹${newPayment.amount}</p>
                    <p>Order Date: ${date}</p>
                    <p>Order ID: ${newPayment.orderId}</p>
                </body>
                </html>
            `
        }; try {
            await transporter.sendMail(mailOptions);
            console.log('Email sent!');
        } catch (error) {
            console.error('Error sending email:', error);
        }

        // Send response to client
        res.status(200).json({
            success: true,
            message: 'Payment processed successfully',
            orderId: newPayment.orderId,
            amount: newPayment.amount,
            date: paymentDate
        });

        // Prepare email options

    } catch (error) {
        console.error('Payment processing error:', error);
        res.status(500).json({
            success: false,
            message: 'Payment processing failed',
            error: error.message
        });
    }
};

export const getAllPaymentDetails = async (req, res) => {
    const { date } = req.body;
    const userId = req.params.userId;

    if (!userId) {
        return res.status(400).json({ message: 'User  ID is required' });
    }

    try {
        const payments = await Payment.find({ userId: userId })
            .lean()
            .select('orderId amount paymentMethod createdAt');

        if (!payments.length) {
            return res.status(404).json({ message: 'No payments found for this user', userId });
        }

        const paymentDate = date ? new Date(date) : new Date();

        const response = payments.map(payment => ({
            orderId: payment.orderId,
            amount: payment.amount,
            paymentMethod: payment.paymentMethod,
            date: paymentDate
        }));

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching all payment details:', {
            message: error.message,
            stack: error.stack,
            userId
        });
        res.status(500).json({ message: 'Internal server error' });
    }
};