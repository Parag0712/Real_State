

import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config({
    path:"./.env"
})


// Using this function you get userId based on token
const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Get token from cookie
        const token = req.cookies?.accessToken 
        if (!token) {
            return res.status(400).json({message:"Unauthorized request"})
        }
        // Decode out Token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password ");

        if (!user) { return res.status(400).json({message:"Invalid Access Token"}) }

        // You Store in Your Object
        req.user = user;
        next();
    } catch (error) {
        return res.status(400).json({message:"Invalid Access Token"})
    }
});

export { verifyJWT }