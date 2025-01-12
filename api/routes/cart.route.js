import express from 'express';
import {checkCartSaveStatus, saveCart} from '../controllers/cart.controller.js';

const router = express.Router();

router.post('/save-cart', saveCart);
router.get('/check-save-status/:userId', checkCartSaveStatus);


export default router;  