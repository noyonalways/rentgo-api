import httpStatus from "http-status";
import mongoose from "mongoose";
import { QueryBuilder } from "../../builder";
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

// make admin
const makeAdmin = async (id: string) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  if (user.status === "blocked") {
    throw new AppError("User is blocked", httpStatus.FORBIDDEN);
  }

  if (user.role === "admin") {
    throw new AppError("User is already admin", httpStatus.BAD_REQUEST);
  }

  return User.findByIdAndUpdate(
    id,
    { role: "admin" },
    {
      new: true,
      runValidators: true,
    },
  );
};

const getAllUsers = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find({}), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();

  return { result, meta };
};

export const userService = {
  findByProperty,
  changeStatus,
  makeAdmin,
  getAllUsers,
};
