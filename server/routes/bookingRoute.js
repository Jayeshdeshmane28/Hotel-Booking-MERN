import express from "express";
import { checkAvailabilityAPI, 
    createbooking, 
    getHotelBookings, 
    getUserBookings
} from "../controller/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";
const bookingRouter= express.Router();

bookingRouter.post("/book", protect,createbooking);
bookingRouter.post("/check-availability", checkAvailabilityAPI);
bookingRouter.get("/user", protect,getUserBookings);
bookingRouter.get("/hotel", protect,getHotelBookings);


export default bookingRouter;