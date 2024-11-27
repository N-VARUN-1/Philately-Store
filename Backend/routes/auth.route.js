import express from 'express';

import {signin, signup, OAuth, adminSignup, adminGoogle, logout} from '../controllers/auth.controller.js';
const router = express.Router();

router.post('/signup',signup);
router.post('/signin',signin);
router.post('/logout', logout);
router.post('/admin-signup',adminSignup);
router.post('/OAuth', OAuth);
router.post('/google', adminGoogle);

export default router;