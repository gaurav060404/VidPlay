import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from '../utils/ApiReponse.js';
import jwt from "jsonwebtoken";

const generateAccessTokenandRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave : false});

        return {accessToken,refreshToken};
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh & access token");
    }
}

const registerUser = asyncHandler(async (req,res) => {
    const {username,email,fullName,password} = req.body;
    if([username,email,fullName,password].some((field)=> field?.trim() === "")){
        throw new ApiError(400,"Please don't leave a field blank");
    }
    const existedUser = await User.findOne({
        $or : [{username},{email}]
    });

    console.log("Existed User :",existedUser);

    if (existedUser) {
        throw new ApiError(409,"Username or Email already exists");
    }
    console.log(req.files);
    console.log(req.files?.avatar);
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400,"Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400,"Avatar couldn't be uploaded");
    }

    const user = await User.create({
        username:username.toLowerCase(),
        email,
        fullName,
        password,
        avatar : avatar.url,
        coverImage : coverImage?.url || ""
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500,"Something went wrong while registering the user");
    }

    return res.status(201).json(new ApiResponse(200,createdUser,"User register successfully"));

});

const loginUser = asyncHandler(async (req,res)=>{
    const {username,email,password} = req.body;

    console.log(username,password);

    if (!username && !email) {
        throw new ApiError(400,"Email or Username is required!");
    }

    const user = await User.findOne({
        $or : [{username},{email}]
    });

    if(!user){
        throw new ApiError(404,"User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401,"Password is incorrect");
    }

    const {accessToken,refreshToken} = await generateAccessTokenandRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const options = {
        httpOnly : true,
        secure : true
    } // cookies only modifiable in backend

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,{
        user : loggedInUser,accessToken,refreshToken
    },"User logged in successfully"))
});

const logoutUser = asyncHandler(async (req,res) => {
    const userId = req.user._id;
    await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            refreshToken: undefined,
          },
        },
        {
          new: true,
        }
      );
    
      const options = {
        httpOnly: true,
        secure: true,
      };
    
      return res
      .status(200)
      .clearCookie("accessToken",options)
      .clearCookie("refreshToken",options)
      .json(new ApiResponse(200,{},"User logged out successfully"));
      
});

const refreshAcessToken = asyncHandler(async (req,res) => {
    try {
        const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    
        if (!incomingRefreshToken) {
            throw new ApiError(401,"Unauthorized request");
        }
    
        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id);
    
        if (!user) {
            throw new ApiError(401,"Invalid refresh token");
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401,"Refresh token is expired or used");
        }
    
        const options = {
            httpOnly : true,
            secure : true
        }
    
        const {accessToken,newrefreshToken} = await generateAccessTokenandRefreshToken(user._id);
    
        return res.
        status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(new ApiResponse(200,{
            accessToken,refreshToken : newRefreshToken
        },"Access token refreshed successfully"));
    } catch (error) {
        throw new ApiError(400,error?.message || "Invalid refresh token");
    }

});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAcessToken
};