import express from "express";
import "dotenv/config";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controller/clerkWebhooks.js";
import userRoute from "./routes/userRoute.js";
import hotelRoute from "./routes/hotelRoute.js";
import connectCloudinary from "./config/cloudinary.js";
import roomRoutes from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoute.js";

const app = express();

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://hotel-booking-frontend-q77p.onrender.com"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked: " + origin), false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// Body parser
app.use(express.json());

// Clerk
app.use(clerkMiddleware());

// Routes
app.use("/api/clerk", clerkWebhooks);
app.get("/", (req, res) => res.send("Api is working"));
app.use("/api/user", userRoute);
app.use("/api/hotels", hotelRoute);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

connectDB();
connectCloudinary();
