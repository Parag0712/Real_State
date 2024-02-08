import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { validateField } from "../utils/Validate.js";
import asyncHandler from "../utils/asyncHandler.js";

import bcrypt from 'bcrypt'

// Update Account 
export const updateUserAccount = asyncHandler(async (req, res, next) => {
    const { username, password, email, avatar } = req.body;

    validateField(username, "username");
    validateField(password, "email");
    validateField(avatar, "avatar");
    validateField(email, "email");

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser && existingUser._id.toString() !== req.user?._id.toString()) {
        if (existingUser.username === username) {

            return res.status(409).json({
                message: "Username already exists"
            })
        } else {
            return res.status(409).json({
                message: "Email already exists"
            })
        }
    }


    const hashPassword = await bcrypt.hash(password, 10)

    // Find And Update
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                username,
                email,
                password: hashPassword,
                avatar
            }
        }
        ,
        {
            new: true //give update value 
        }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(200, { user }, "Account details updated successfully")
        )
});

//Delete Account
export const deleteAccount = asyncHandler(async (req, res, next) => {
    const deleteAccount = await User.findByIdAndDelete(req.user?._id);
    if (deleteAccount) {
        return res
            .status(200)
            .clearCookie("accessToken", { httpOnly: true })
            .clearCookie("refreshToken", { httpOnly: true })
            .json(new ApiResponse(200, {}, "User Account Deleted"))
    } else {
        return res.status(409).json({
            message: "Internal Server Error"
        })
    }
});


export const getUserListing = asyncHandler(async (req,res)=>{
    const Listing = await User.find({_id:req.user._id}).populate('listing');

    if(!Listing){
        return res.status(404).json({
            message: "You currently have no listings. Please create a listing to proceed."
        })
    }

    const {username,email,avatar,_id} = Listing[0];        
    return res
    .status(200)
    .json(
        new ApiResponse(200, {
            User:{
                _id,username,email,avatar
            },
            Listing:Listing[0].listing
        },
            "User Listing Fetched Successfully"
        )
    )
})


