import Order from '../models/payments.model.js'; // Adjust the import based on your project structure

export const getOrderDetails = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findOne({ orderId }); // Assuming orderId is a field in your Order model
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};