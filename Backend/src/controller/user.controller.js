import {asyncHandler} from '../utils/asyncHandler.js'
import {APIresponse} from '../utils/APIresponse.js'
import {ApiError} from '../utils/APIerror.js'
import {User} from '../models/user.model.js'
import {fetchChessDotComUser} from '../utils/fetchChess.js'
import { updateAllUserStats } from '../utils/chessUpdater.js';

const generateAccessandRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "something went wrong while generating refresh and access tokens.", error);
    }
}

const signIn = asyncHandler(async(req, res) => {
    const {username} = req.body
    if(!username) {
        console.error("Please provide the username")
        return res.status(400).json(new ApiError(400, "Please provide the username"))
    }
    let existingUser = await User.findOne({username})
    if(!existingUser) {
      const user = await fetchChessDotComUser(username)

      if(!user) {
          console.error("User not found")
          return res.status(404).json(new ApiError(404, "User not found"))
      }
      existingUser = await User.create({
          username,
          avatar: user.avatar || "",
          playerid: user.player_id,
          country: user.country.split('https://api.chess.com/pub/country/')[1] || "",
          isVerified: user.verified,
          league: user.league
      })

    }
    const {refreshToken, accessToken} = await generateAccessandRefreshTokens(existingUser._id)

    const loggedInUser = await User.findOne({username}).select("-token")
    
    return res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 15 * 24 * 60 * 60 * 1000,
    })
    .json(
      new APIresponse(
        200,
        {
          user: loggedInUser
        },
        "User logged in successfully"
      )
    );
})

const getStats = asyncHandler(async(req, res) => {
  const userId = req.user?._id
  const user = await User.findById(userId)
  if(!user) {
    console.error("User not found")
    return res.status(404).json(new ApiError(404, "User not found"))
  }
  await updateAllUserStats(user.username);

  const updatedUser = await User.findById(userId)
  const stats = {
    rapid: updatedUser.stats?.rapid,
    blitz: updatedUser.stats?.blitz,
    bullet: updatedUser.stats?.bullet
  }
  return res.status(200).json(new APIresponse(200, stats, "Stats fetched successfully"));
})

export {
  signIn,
  getStats
}