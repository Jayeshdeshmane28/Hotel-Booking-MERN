

// function to check availability of room and room

import Booking from "../model/Booking.js"
import Room from "../model/Room.js"
import Hotel from "../model/Hotel.js"

const checkAvailability= async (room, checkInDate, checkOutDate) => {
    try{
        const bookings= await Booking.find({
            room,
            checkInDate:{ $lte: checkOutDate },
            checkOutDate:{ $gte:checkInDate}
        })

       const isAvailable= bookings.length === 0 ;
        return isAvailable;
    }catch(error){
        console.log(error.message);
        
    }
}

// Api to check availability of room
// post/api/booking/check-availability

export const checkAvailabilityAPI= async (req, res) => {
    try{
        const{room, checkInDate, checkOutDate}=req.body;
  
        const isAvailable = await checkAvailability(room, checkInDate, checkOutDate);
        res.json({success:true, isAvailable})
    }catch(error){
        console.error("Error checking availability:", error.message);
        res.json({success:false, message:error.message})
    }
}


// Api to create a new booking
// post/api/bookings/book

export const createbooking= async (req, res) => {
    try{
        // Before check availability of room    
        const {room, checkInDate, checkOutDate,guests}=req.body;
        const user= req.user.id;
        const isAvailable= await checkAvailability(room, checkInDate, checkOutDate)
        if(!isAvailable){
            res.json({success:false, message:"Room is not available"})
            console.log( "Availability result:", isAvailable);
            
        }
        // get toatalprice for room
        const roomData= await Room.findById(room).populate("hotel");
        let totalPrice=roomData.pricePerNight;

        // calculate total price based on nights
        const checkIn= new Date(checkInDate);
        const checkOut= new Date(checkOutDate);
        const timeDiff= checkOut.getTime()- checkIn.getTime();
        const nights = Math.ceil(timeDiff/(1000*3600*24));

        totalPrice= totalPrice * nights;

        // create new booking
        const booking= await Booking.create({
            room,
            user,
            hotel: roomData.hotel._id,
            guests:+guests,
            checkInDate,
            checkOutDate,
            totalPrice
        })
        res.json({success:true, message:"Booking created successfully", booking})

    }catch(error){
        console.log(error.message);
        res.json({success:false, message:"failed to create booking"})
    }
}

// Api to get all bookings of user
// get/api/bookings/user

export const getUserBookings= async (req, res) => {
    try{
        const user= req.user._id;
        const bookings= await Booking.find({user}).populate("room").populate("hotel").sort({createdAt:-1})
        res.json({success:true, bookings})
    }catch(error){
        console.log(error.message);
        res.json({success:false, message:"failed to fetch bookings"})
    }
}

export const getHotelBookings= async (req, res) => {
   try{
        const hotel = await Hotel.findOne({ owner: req.auth.userId });
        if (!hotel) {
        return res.status(404).json({ success: false, message: "Hotel not found" });
    }
        const bookings = await Booking.find({ hotel: hotel._id }).populate("room hotel user").sort({ createdAt: -1 });

        // Total bookings
        const totalBookings = bookings.length;

        // toatal revenue
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);
        res.json({ success: true, dashboardData: { totalBookings, totalRevenue, bookings } });
   }catch(error){   
    res.status(500).json({ success: false, message: "Failed to fetch hotel bookings" });
   }

     
}

