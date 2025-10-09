import Hotel from "../model/Hotel.js";

import User from "../model/User.js";

export const registerHotel= async (req, res) => {
    try{
        const {name,address,contact,city}=req.body;
        const owner=req.user._id;

        // check if User already Registered 
        const hotel = await Hotel.findOne({owner})
        if(hotel){
            return res.json({success:false, message:"Hotel already registered"})
        }
        await Hotel.create({name,address,contact,owner,city})
       
        await User.findByIdAndUpdate(owner, {role:"hotelOwner"})
        return res.json({success:true, message:"Hotel registered successfully"})
    }
    catch(error){
         console.error("Error registering hotel:", error);   
         res.json({success:false, message:error.message})
    }
}