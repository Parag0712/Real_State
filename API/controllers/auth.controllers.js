import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js"


// Validate Field
function validateField(value, fieldName) {
    if (value.trim() === "") {
        return res.status(400).json(`${fieldName} is required`)
    }
}

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
    const obj = {
        accessToken: accessToken,
        data: user,
        message: "Register Successfully"
    }

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
        httpOnly: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Logged Out"))
})
