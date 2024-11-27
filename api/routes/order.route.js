import express from 'express';
import { getOrderDetails } from '../controllers/order.controller.js';

const router = express.Router();

// Add the new route for fetching order details
router.get('/orders/:orderId', getOrderDetails);

export default router;