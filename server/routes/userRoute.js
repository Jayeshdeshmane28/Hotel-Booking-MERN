import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getUserData, storeRecentSearchedCities } from "../controller/userController.js";

const userRoute = express.Router();

userRoute.get('/',protect, getUserData ); 
userRoute.post('/store-recent-search',protect, storeRecentSearchedCities ); 


export default userRoute;