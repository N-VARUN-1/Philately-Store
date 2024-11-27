import express from 'express';
import { getAllPaymentDetails, savePayments } from '../controllers/payment.controller.js';

const router = express.Router();

router.post(`/paymentGateway`, savePayments);
// router.get('/paymentOrder', getPaymentDetails);
router.get('/paymentOrders/:userId', getAllPaymentDetails);
export default router;