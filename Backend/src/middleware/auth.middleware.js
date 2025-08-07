import jwt from "jsonwebtoken";
import { ApiError } from '../utils/APIerror.js'
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js";

export const verifyJWT = asyncHandler(
  async (req, res, next) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("bearer ", "");

    console.log(token)

    if (!token) return res.status(401).json(new ApiError(401, "Unauthorized request"));

    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET 
    );

    console.log(decodedToken)

    const user = await User.findById(
      (decodedToken)?._id
    ).select("-password -refreshToken");

    if (!user) return res.status(401).json(new ApiError(401, "Invalid Access Token"));

    req.user = user;
    next();
  }
);