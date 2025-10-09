import User from "../model/User.js";
import { clerkClient } from "@clerk/express";

// middleware to check if user is authenticated

export const protect = async (req, res, next) => {
    try {
        const { userId } = req.auth || {};
        if (!userId) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        let user = await User.findById(userId);

        // Lazily create a local DB user if it doesn't exist yet
        if (!user) {
            const clerkUser = await clerkClient.users.getUser(userId);
            const userData = {
                _id: clerkUser.id,
                email: clerkUser.emailAddresses?.[0]?.emailAddress || "",
                username: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || clerkUser.username || "User",
                image: clerkUser.imageUrl || "",
                recentSearchedCities: []
            };
            user = await User.create(userData);
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth protect error:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}