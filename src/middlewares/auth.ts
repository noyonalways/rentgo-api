import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/AppError";
import { TUserRoles } from "../modules/user/user.interface";
import User from "../modules/user/user.model";
import catchAsync from "../utils/catchAsync";

const auth = (...requiredRoles: TUserRoles[]) => {
  return catchAsync(async (req, _res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return next(new AppError("Unauthorized Access", httpStatus.UNAUTHORIZED));
    }

    const decoded = jwt.verify(
      token,
      config.jwt_access_token_secret as string,
    ) as JwtPayload;

    const { email, role } = decoded;

    // check the use is exists or not
    const user = await User.isUserExists("email", email);
    if (!user) {
      throw new AppError("User not found", httpStatus.NOT_FOUND);
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError("Access Forbidden", httpStatus.FORBIDDEN);
    }

    req.user = decoded;
    next();
  });
};

export default auth;
