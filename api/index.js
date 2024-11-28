import express from 'express'
// import path from 'path'
// // import cors from 'cors';

// import { fileURLToPath } from 'url';


// const __filename = fileURLToPath(import.meta.url);

// // Get __dirname
// const __dirname = path.dirname(__filename);


const app = express()


// const allowedOrigins = [
//   process.env.VITE_FRONTEND_URL, // Use an environment variable for the production frontend URL
//   'http://localhost:5173' // Development frontend URL
// ];

// app.use(cors({
//   origin: allowedOrigins,
//   credentials: true // Allow cookies to be sent with requests
// }));




// // import userRoutes from '../api/routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cartRoutes from './routes/cart.route.js';
import delAddrRoutes from './routes/delivery.route.js';
import payRoutes from './routes/payment.route.js';

import dotenv from 'dotenv';
dotenv.config();


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.VITE_API_PORT, () => {
  console.log(`Server running on port ${process.env.VITE_API_PORT}`)
})



import mongoose from 'mongoose';
mongoose.connect(process.env.VITE_MONGO_URI).then(()=>{
  console.log("Mongo is Connected");
})
.catch((err)=>{
  console.log(err);
})

app.use(express.json());      // Make sure your server is properly parsing JSON bodies. If you're using Express, ensure you have the JSON middleware:
app.use(cookieParser());
// app.use(bodyParsor.json());


// app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/addr', delAddrRoutes);
app.use('/api/pay', payRoutes);

