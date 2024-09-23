import httpStatus from "http-status";
import mongoose from "mongoose";
import { AppError } from "../../errors";
import { TUser } from "./user.interface";
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

// change user status
const changeStatus = async (id: string, payload: Pick<TUser, "status">) => {
  const user = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  return user;
};

export const userService = {
  findByProperty,
  changeStatus,
};
