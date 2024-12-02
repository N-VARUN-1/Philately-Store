import User from '../models/user.model.js';
import adminPortal from '../models/admin.model.js';
import mongoose from 'mongoose';
import transporter from '../nodemailer/mailer.js';

import 'dotenv';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';


/////////// User - SIGN UP ///////////
export const signup = async (req, res) => {
    const {
        email,
        applicantName,
        password,
        mailingAddress,
        pin,
        recipientName,
        recipientAddress,
        customerType,
        subscriptionFrequency,
    } = req.body;

    // Validate required fields
    if (!applicantName || !email ||!password || !mailingAddress || !pin || !customerType || !subscriptionFrequency) {
        return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const existingUser = await User.findOne({email});

    if(existingUser){
        // alert('User exists with this email !');
        return res.status(409).json({message: "User exists with this email"});
    }

    const userIdGenerator = async () => {
        let userId;
        let isUnique = false;
        while(!isUnique){
            userId = 'PS' + Math.random().toString(36).substr(2, 6).toUpperCase();

            const userExists = await User.findOne({userId});
            if(!userExists){
                isUnique = true;
            }
        }
        return userId;
    }

    const userId = await userIdGenerator();

    const newUser  = new User({
        userId,
        applicantName,
        email,
        password,
        mailingAddress,
        pin,
        recipientName: recipientName || null, // Optional field
        recipientAddress: recipientAddress || null, // Optional field
        customerType,
        subscriptionFrequency,
    });

    try {
        await newUser .save();
        
        // emailing the userID 
        const mailOptions = {
            from: 'varun.n.1515@gmail.com',
            to: email,
            subject: 'Welcome to Philately Store! Your User ID',
            text: `Thank you for signing up! Your Login Credentials: \n\n UserId: ${userId} \n Password: ${password} \n\n Use these credentials to login to Philately Store \n\n Best regards \n Philately Store
            `,
        };
        
        await transporter.sendMail(mailOptions);

        console.log('Received signup request');
        res.status(201).json({ message: 'User  created successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message,
        });
    }
};

/////////// User - SIGN IN ///////////
export const signin = async (req, res) => {
    const { email, userId, password } = req.body;
    res.header('Access-Control-Allow-Origin', 'https://philately-store-frontend.vercel.app');
    if (!email || !password || !userId) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    try {
        const validUser  = await User.findOne({ email });
        if (!validUser ) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: validUser ._id, pass: validUser.password }, process.env.VITE_JWT_SECRET);
        const { password: pass, ...rest } = validUser ._doc;

        res.status(200).cookie('access_token', token, {
            httpOnly: true,
        }).json({ ...rest, _id: validUser._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/////////// User Logout ///////////
export const logout = async (req, res) => {
  try {
    // Clear any server-side session or token
    res.clearCookie('access_token'); // If using cookies
    res.status(200).json({ message: 'User has been signed out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error during sign out', error: error.message });
  }
};

/////////// ADMIN PORTAL SIGN UP ///////////
export const adminSignup = async (req, res) => {
    const { adminId, FullName, email, password, confirmPassword } = req.body;

    if (!adminId || !FullName || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newAdmin = new adminPortal({ ...req.body, password: hashedPassword });

    try {
        await newAdmin.save();
        console.log('Received signup request');
        res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message,
        });
    }
};

/////////// admin - Google SignUp-SignIn ///////////
export const adminGoogle = async (req, res) => {
    const { name, email, googlePhotoURL } = req.body;
    try {
        const admin = await adminPortal.findOne({ email });
        if (admin) {
            const token = jwt.sign({ id: admin._id, isAdmin: true }, process.env.VITE_JWT_SECRET);
            const { password, confirmPassword, ...rest } = admin._doc;
            res.status(200)
               .cookie('access_token', token, {
                   httpOnly: true,
               })
               .json(rest);
        } else {
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
            const adminId = 'ADM' + name.split(' ')[0].toLowerCase();

            const newAdmin = new adminPortal ({
                adminId,
                FullName: name,
                email,
                password: hashedPassword,
                confirmPassword: hashedPassword,
            });

            await newAdmin.save();
            const token = jwt.sign({ id: newAdmin._id, isAdmin: true }, process.env.VITE_JWT_SECRET);
            const { password, confirmPassword, ...rest } = newAdmin._doc;
            res.status(201)
               .cookie('access_token', token, {
                   httpOnly: true,
               })
               .json(rest);
        }
    } catch (error) {
        console.error('Error in adminGoogle:', error);
        res.status(500).json({ 
            message: 'Internal Server Error', 
            error: error.message 
        });
    }
};

/////////// OAuth ///////////
export const OAuth = async (req, res) => {
    const { name, email, googlePhotoURL } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.VITE_JWT_SECRET);
            const { password: pass, ...rest } = user._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json(rest);
            if (!res.ok) {
                res.status(404).json({ message: 'User  Not found!' });
            }
        } else {
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
            const newUser  = new User({
                username: name.toLowerCase().split(' ').join(''), 
                email, 
                password: hashedPassword,
                profilePicture: googlePhotoURL
            });
            await newUser .save();
            const token = jwt.sign({ id: newUser ._id, isAdmin: newUser .isAdmin }, process.env.VITE_JWT_SECRET);
            const { password: pass, ...rest } = newUser ._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json(rest);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


