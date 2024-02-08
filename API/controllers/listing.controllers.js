import Listing from "../models/listing.model.js";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Create Listing
export const createListing = async (req, res, next) => {
    try {
        const requiredFields = [
            "imageUrls", "name", "description", "address", "rent", "sell", "bedrooms", "bathrooms", "regularPrice", "discountPrice", "offer", "parking", "furnished"
        ];
        console.log(req.body);
        const missingFields = requiredFields.filter(field => !(field in req.body) || req.body[field] === undefined || req.body[field] === "");

        // If any required field is missing or empty, return a 400 status with a meaningful error message
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Please provide values for the following required fields: ${missingFields.join(", ")}.`
            });
        }

        // Get user id
        const id = req.user._id;
        req.body.userRef = id;

        // create listing post
        const listingPost = await Listing.create(req.body);

        // listingPost
        if (!listingPost) {
            return res.status(400).json({
                message: "Sorry, we're currently experiencing high traffic. Please try again later."
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        user.listing.push(listingPost._id);
        await user.save();

        return res
            .status(200)
            .json(new ApiResponse(200, { listingPost }, "Your listing has been successfully created."))
    } catch (error) {
        next(error);
    }
};


export const getListings = asyncHandler(async (req, res) => {
    const listing = await Listing.find().populate({
        path: 'userRef',
        select: "_id username email avatar"
    });

    return res
        .status(200)
        .json(
            new ApiResponse(200, {
                Listing: listing
            },
                "User Listing Fetched Successfully"
            )
        )
})
export const deleteListing = asyncHandler(async (req, res, next) => {
    const listingId = req.params.id;

    const listing = await Listing.findById(listingId);

    if (!listing) {
        return res.status(400).json({ message: "Data Not found" })
    }

    const deleteAccount = await Listing.findByIdAndDelete(listingId);
    if (deleteAccount) {
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Listing Deleted"))
    } else {
        return res.status(409).json({
            message: "Internal Server Error"
        })
    }
});