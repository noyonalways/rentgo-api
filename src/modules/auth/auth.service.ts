import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { AppError } from "../../errors";
import { TUser } from "../user/user.interface";
import User from "../user/user.model";
import { TUserSignIn } from "./auth.interface";

// sign up user
const singUp = async (payload: TUser) => {
  return User.create(payload);
};

// sing in user
const singIn = async (payload: TUserSignIn) => {
  const user = await User.isUserExists("email", payload.email);

  if (!user) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  if (!(await User.isPasswordMatch(payload.password, user.password))) {
    throw new AppError("Incorrect credentials", httpStatus.UNAUTHORIZED);
  }

  if (user.status === "blocked") {
    throw new AppError("User is blocked", httpStatus.FORBIDDEN);
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = User.createToken(
    jwtPayload,
    config.jwt_access_token_secret as string,
    config.jwt_access_token_expires_in as string,
  );

  const refreshToken = User.createToken(
    jwtPayload,
    config.jwt_refresh_token_secret as string,
    config.jwt_refresh_token_expires_in as string,
  );

  user.password = "";

  return { accessToken, refreshToken };
};

// get signed in user
const getMe = async (payload: JwtPayload) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }
  return user;
};

// update user details
const updateProfile = async (email: string, payload: TUser) => {
  const user = await User.isUserExists("email", email);
  if (!user) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  const updatedUser = await User.findByIdAndUpdate(user._id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedUser;
};

// generate access token using refresh token
const generateNewAccessToken = async (refreshToken: string) => {
  const decoded = jwt.verify(
    refreshToken,
    config.jwt_refresh_token_secret as string,
  ) as JwtPayload;

  const { email } = decoded;

  // check the user exist
  const user = await User.isUserExists("email", email);
  if (!user) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  // check the user is deleted or not
  if (user.isDeleted) {
    throw new AppError("User is already deleted", httpStatus.FORBIDDEN);
  }

  // check the user is block or active
  if (user.status === "blocked") {
    throw new AppError("User is blocked", httpStatus.FORBIDDEN);
  }

  // TODO: password change check validation

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = User.createToken(
    jwtPayload,
    config.jwt_access_token_secret as string,
    config.jwt_access_token_expires_in as string,
  );

  return { token: accessToken };
};

export const authService = {
  singUp,
  singIn,
  getMe,
  updateProfile,
  generateNewAccessToken,
};
