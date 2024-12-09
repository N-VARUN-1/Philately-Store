import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

// Import routes
import authRoutes from './routes/auth.route.js';
import cartRoutes from './routes/cart.route.js';
import delAddrRoutes from './routes/delivery.route.js';
import payRoutes from './routes/payment.route.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS setup
app.use(cors({
  origin: [
    'https://philately-store-frontend.vercel.app',
    'http://localhost:3000', // If testing locally
    'https://philately-store-frontend.vercel.app/'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Methods',
    'Access-Control-Allow-Headers'
  ],
  credentials: true
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://philately-store-frontend.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true'); // For cookies or authentication
    next();
});


// Explicit OPTIONS handler
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(cookieParser());

// MongoDB connection
mongoose.connect(process.env.VITE_MONGO_URI)
  .then(() => console.log('Mongo is Connected'))
  .catch((err) => console.error(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/addr', delAddrRoutes);
app.use('/api/pay', payRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Test route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start server
app.listen(process.env.VITE_API_PORT, () => {
  console.log(`Server running on port ${process.env.VITE_API_PORT}`);
});
