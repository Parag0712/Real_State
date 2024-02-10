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

// Get listing
export const getAllListings = asyncHandler(async (req, res) => {
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
});

// Get Single Listing
export const getListing = asyncHandler(async (req, res) => {
    const listingId = req.params.id;
    const listing = await Listing.findOne({ _id: listingId }).populate({
        path: 'userRef',
        select: "_id username email avatar"
    });
    if (listing == null) {
        return res.status(400).json({ message: "Data Not found" })
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, {
                Listing: listing,
            },
                "User Listing Fetched Successfully"
            )
        )

})

// Get Filter Listing
export const getFilterListing = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 9
    const startIndex = parseInt(req.query.startIndex) || 0


    let offer = req.query.offer
    if (offer === undefined || offer == false) {
        offer = { $in: [false, true] }
    }

    // Furnished
    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === false) {
        furnished = { $in: [false, true] };
    }

    // Parking
    let parking = req.query.parking;

    if (parking === undefined || parking === false) {
        parking = { $in: [false, true] };
    }

    // type
    let rent = req.query.rent;

    if (rent === undefined || rent === false) {
        rent = { $in: [false, true] };
    }


    let sell = req.query.sell;

    if (sell === undefined || sell === false) {
        sell = { $in: [false, true] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';


    const listing = await Listing.find({
        name: { $regex: searchTerm, $options: 'i' },
        parking,
        furnished,
        $or: [
            { rent: { $exists: rent } },
            { sell: { $exists: sell } }
        ],
        offer
    })
        .sort({ [sort]: order })
        .limit(limit)
        .skip(startIndex)


    return res
        .status(200)
        .json(
            new ApiResponse(200, {
                Listing: listing,
            },
                "Search Fetched Successfully"
            )
        )


})
// Delete listing
export const deleteListing = asyncHandler(async (req, res, next) => {
    const listingId = req.params.id;

    const listing = await Listing.findById(listingId);

    if (!listing) {
        return res.status(400).json({ message: "Data Not found" })
    }

    const listingDelete = await Listing.findByIdAndDelete(listingId);
    if (listingDelete) {
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Listing Deleted"))
    } else {
        return res.status(409).json({
            message: "Internal Server Error"
        })
    }
});

// Edit Listing
export const editListing = asyncHandler(async (req, res) => {

    const listingId = req.params.id;

    const requiredFields = [
        "imageUrls", "name", "description", "address", "rent", "sell", "bedrooms", "bathrooms", "regularPrice", "discountPrice", "offer", "parking", "furnished"
    ];

    const missingFields = requiredFields.filter(field => !(field in req.body) || req.body[field] === undefined || req.body[field] === "");

    // If any required field is missing or empty, return a 400 status with a meaningful error message
    if (missingFields.length > 0) {
        return res.status(400).json({
            message: `Please provide values for the following required fields: ${missingFields.join(", ")}.`
        });
    }

    const listing = await Listing.findOne({ _id: listingId });
    if (listing == null) {
        return res.status(400).json({ message: "Data Not found" })
    }

    const updateListing = await Listing.findByIdAndUpdate(
        listing,
        req.body,
        { new: true }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(200, { updateListing }, "Listing details updated successfully")
        )
})