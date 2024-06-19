import httpStatus from "http-status";
import config from "../../config";
import AppError from "../../errors/AppError";
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

  return { user, accessToken, refreshToken };
};

export const authService = {
  singUp,
  singIn,
};
