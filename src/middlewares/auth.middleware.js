import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        // console.log("Received Token:", token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Access Token")
    }

})

// export const verifyJWT = asyncHandler(async (req, _, next) => {
//     try {
//         // Attempt to get the token from cookies or Authorization header
//         const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");
//         console.log("Received Token:", token); // Debug: check what is being received

//         if (!token) {
//             console.error("Token not received: check if it's sent correctly from the client side."); // Better error message
//             throw new ApiError(401, "Unauthorized request");
//         }

//         // Verify token
//         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//         console.log("Decoded Token:", decodedToken); // Debug: verify token structure

//         // Find user based on token
//         const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

//         if (!user) {
//             console.error("User not found with the provided token."); // Log more specific errors
//             throw new ApiError(401, "Invalid Access Token");
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         console.error("Error in verifyJWT:", error.message); // Log the exact error
//         throw new ApiError(401, error?.message || "Invalid Access Token");
//     }
// });
