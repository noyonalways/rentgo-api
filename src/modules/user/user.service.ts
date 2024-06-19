import httpStatus from "http-status";
import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import User from "./user.model";

// find user by property
const findByProperty = (key: string, value: string) => {
  if (key === "_id") {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new AppError("invalid objectId", httpStatus.BAD_REQUEST);
    }
    return User.findById(value);
  }
  return User.findOne({ [key]: value });
};

export const userService = {
  findByProperty,
};
