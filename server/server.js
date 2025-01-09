import express from 'express';
import { connectDB } from './db/connectDB.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';

dotenv.config();

const app = express();
app.use(cookieParser());

app.use(
    cors({
      origin: process.env.CLIENT_URL, 
      credentials: true, 
    })
  );

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

const PORT = process.env.PORT || 5000;

app.use("/api/auth" , authRoutes)
app.use("/api/product" , productRoutes)
app.use("/api/cart" , cartRoutes)

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
    connectDB()
})