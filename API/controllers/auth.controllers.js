import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js"
import { validateField } from "../utils/Validate.js";

import jwt from 'jsonwebtoken'

// Genrate-Token
const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, error + "Something went wrong while generating access and refresh token 1");
    }
}


// Register API
export const register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    validateField(username, "username");
    validateField(email, "email");
    validateField(password, "password");

    // Find Exist User or not
    const existedUser = await User.findOne({
        $or: [{ username: username }, { email: email }]
    });

    if (existedUser) {
        return res.status(409).json({
            message: "User with email or username already exists"
        })
    }

    // Create User In Database
    const user = await User.create({
        username: username,
        email: email,
        password: password,
    })

    user.password = undefined;
    user.refreshToken = undefined;

    if (!user) {
        return res.status(500).json(
            { message: "Something went wrong while registering the user" }
        )
    }
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);
    
    return res
        .status(200)
        .cookie('accessToken', accessToken, { httpOnly: true })
        .cookie("refreshToken", refreshToken, { httpOnly: true })
        .json(
            new ApiResponse(200, {
                user,
                accessToken: accessToken,
                refreshToken: refreshToken
            }, "User Register Successfully")
        )
});

export const google = asyncHandler(async (req, res) => {
    const { username, email, avatar } = req.body;
    const user = await User.findOne({ email })
    if (user) {
        // If User Exist
        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);
        user.password = undefined;
        user.refreshToken = undefined;

        return res
            .status(200)
            .cookie('accessToken', accessToken, { httpOnly: true })
            .cookie("refreshToken", refreshToken, { httpOnly: true })
            .json(
                new ApiResponse(200, {
                    user,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }, "User Login Successfully")
            )
    } else {
        const generatedPassword =
            Math.random().toString(36).slice(-8) +
            Math.random().toString(36).slice(-8);

        const user = await User.create({
            username: username.split(' ').join('').toLowerCase() +
                Math.random().toString(36).slice(-4),
            email: email,
            avatar: avatar,
            password: generatedPassword,
        });

        user.password = undefined;
        user.refreshToken = undefined;

        if (!user) {
            return res.status(500).json(
                { message: "Something went wrong while registering the user" }
            )
        }

        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

        return res
            .status(200)
            .cookie('accessToken', accessToken, { httpOnly: true })
            .cookie("refreshToken", refreshToken, { httpOnly: true })
            .json(
                new ApiResponse(200, {
                    user,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }, "User Register Successfully")
            )
    }
})

// Login API
export const login = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!username && !email) {
        return res.status(400).json({
            message: "Username or Email is required"
        })
    }
    validateField(password);

    const user = await User.findOne({
        $or: [{ username: username }, { email: email }]
    });

    if (!user) { return res.status(404).json({ message: "User does Not Exist" }) }
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid user credentials" })
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    const options = {
        httpOnly: true
    }

    // We Send Here Response 
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: loggedInUser,
                accessToken: accessToken,
                refreshToken: refreshToken,
            },
                "User Logged In Successfully"
            )
        )
});

// give Login User Details
export const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(200, { user: req.user }, "User fetched successfully")
        )
});

// Logout API
export const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: ""
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Logged Out"))
})


export const refreshAccessToken = asyncHandler(async (req, res, next) => {
    // Req.body.refreshToken give body
    const incomingRefreshToken = req.cookies.refreshToken || req.query.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request");
    }

    try {
        //decodeToken
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        //find user
        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        //if match then give new token
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        // Options
        const options = {
            httpOnly: true,
            secure: true
        }

        //generate new token
        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

        user.refreshToken = refreshToken
        await user.save()
        //send cookie and status
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        user,
                        accessToken:accessToken,
                        refreshToken: refreshToken
                    },
                    "Access Token refreshed"
                )
            );
    } catch (error) {
        //if some error then give error
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
});
