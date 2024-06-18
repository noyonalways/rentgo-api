import httpStatus from "http-status";
import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import { TCar } from "./car.interface";
import Car from "./car.model";

const create = (payload: TCar) => {
  return Car.create(payload);
};

const getAll = async () => {
  return Car.find();
};

const findByProperty = (key: string, value: string) => {
  if (key === "_id") {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new AppError("invalid objectId", httpStatus.BAD_REQUEST);
    }
    return Car.findById(value);
  }
  return Car.findOne({ [key]: value });
};

export const carService = {
  create,
  getAll,
  findByProperty,
};
