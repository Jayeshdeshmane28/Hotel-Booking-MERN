

// routes/hotelRoute.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; // Add .js extension
import { registerHotel } from '../controller/hotelController.js'; // Ensure .js here too

const hotelRoute = express.Router();

hotelRoute.post('/', protect, registerHotel);

export default hotelRoute;