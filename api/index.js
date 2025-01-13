import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors';
// import bodyParser from 'body-parser'
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cartRoutes from './routes/cart.route.js';
import delAddrRoutes from './routes/delivery.route.js';
import payRoutes from './routes/payment.route.js';

const app = express();

const port = process.env.VITE_API_PORT || 3000

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



app.use(cors({
  origin: process.env.VITE_FRONTEND_URL,
  method: ['POST', 'GET'],
  credentials: true // Allow cookies to be sent with requests
}));






app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.VITE_API_PORT, '0.0.0.0', () => {
  try {
    console.log(`Server running on port ${port}`)
  } catch (error) {
    console.log(error);
  }
})




mongoose.connect(process.env.VITE_MONGO_URI).then(() => {
  console.log("Mongo is Connected");
})
  .catch((err) => {
    console.log(err);
  })

app.use(express.json());      // Make sure your server is properly parsing JSON bodies. If you're using Express, ensure you have the JSON middleware:
app.use(cookieParser());
// app.use(bodyParser.json());


// app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/addr', delAddrRoutes);
app.use('/api/pay', payRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/Philately/dist')));

// Catch-all handler for any request not matched
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'Phiilately', 'dist', 'index.html'));
});
