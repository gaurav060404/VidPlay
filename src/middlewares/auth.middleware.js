import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"; 

export const verifyJWT = asyncHandler(async (req,res,next) => {
    try {
        console.log(req.cookies?.accessToken);
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");

        if (!accessToken) {
            throw new ApiError(401,"Unauthorized Request");
        }
    
        const decodedToken = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        );
    
        if (!user) {
            //frontend issue
            throw new ApiError(401,"Invalid Access Token");
        }
    
        req.user = user; 
        next();
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Access Token");
    }
});