import httpStatus from "http-status";
import config from "../../config";
import { catchAsync, sendResponse } from "../../utils";
import { authService } from "./auth.service";

const signUp = catchAsync(async (req, res) => {
  const result = await authService.singUp(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Sing Up successfully",
    data: result,
  });
});

const signIn = catchAsync(async (req, res) => {
  const { accessToken, refreshToken } = await authService.singIn(req.body);

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 60 * 365,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Sign In successfully",
    data: {
      token: accessToken,
    },
  });
});

// get me (current signed in user)
const getMe = catchAsync(async (req, res) => {
  const user = await authService.getMe(req.user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User fetched successfully",
    data: user,
  });
});

// update user details (current signed in user)
const updateProfile = catchAsync(async (req, res) => {
  const updatedUser = await authService.updateProfile(req.user.email, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile updated successfully",
    data: updatedUser,
  });
});

// generate access token using refresh token
const generateNEwAccessToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await authService.generateNewAccessToken(refreshToken);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Access token retrieved successfully",
    data: result,
  });
});

export const authController = {
  signUp,
  signIn,
  getMe,
  updateProfile,
  generateNEwAccessToken,
};
