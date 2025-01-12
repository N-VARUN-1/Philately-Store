import express from 'express';
import { saveDeliveryAdd } from '../controllers/deliveryAdd.controller.js';

const router = express.Router();

router.post('/save-deliveryAddr', saveDeliveryAdd);

export default router;