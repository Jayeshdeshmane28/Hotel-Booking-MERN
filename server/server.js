import express from "express";
import "dotenv/config";
import cors from "cors";
import {connectDB} from './config/db.js';
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controller/clerkWebhooks.js";
import userRoute from "./routes/userRoute.js";
import hotelRoute from "./routes/hotelRoute.js";
import connectCloudinary from "./config/cloudinary.js";
import roomRoutes from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoute.js";

const app=express()
app.use(cors())

// middleware
app.use(express.json())
app.use(clerkMiddleware())

// Api to listen Clerk webhooks
app.use("/api/clerk",clerkWebhooks)

app.get('/',(req ,res)=>res.send("Api is working"))
app.use('/api/user', userRoute)
app.use('/api/hotels', hotelRoute)
app.use('/api/rooms', roomRoutes)
app.use('/api/bookings', bookingRouter)

const PORT=process.env.PORT || 3000;

app.listen(PORT,()=>console.log(`server is runing on port ${PORT}`));

connectDB()
connectCloudinary()