import httpStatus from "http-status";
import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authService } from "./auth.service";

const signUp = catchAsync(async (req, res) => {
  const result = await authService.singUp(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    data: result,
  });
});

const signIn = catchAsync(async (req, res) => {
  const { accessToken, refreshToken, user } = await authService.singIn(
    req.body,
  );

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    data: user,
    token: accessToken,
  });
});

export const authController = {
  signUp,
  signIn,
};
