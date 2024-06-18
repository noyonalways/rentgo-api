import httpStatus from "http-status";
import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import { TCar } from "./car.interface";
import Car from "./car.model";

// create a new car
const create = (payload: TCar) => {
  return Car.create(payload);
};

// get all cars
const getAll = async () => {
  return Car.find();
};

// find car by property
const findByProperty = (key: string, value: string) => {
  if (key === "_id") {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new AppError("invalid objectId", httpStatus.BAD_REQUEST);
    }
    return Car.findById(value);
  }
  return Car.findOne({ [key]: value });
};

// update a car
const updateSingle = async (id: string, payload: TCar) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("invalid objectId", httpStatus.BAD_REQUEST);
  }

  const updatedCar = await Car.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedCar) {
    throw new AppError("No Data found", httpStatus.NOT_FOUND);
  }

  return updatedCar;
};

// delete a car
const deleteSingle = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("invalid objectId", httpStatus.BAD_REQUEST);
  }

  const deletedCar = await Car.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!deletedCar) {
    throw new AppError("No Data found", httpStatus.NOT_FOUND);
  }

  return deletedCar;
};

export const carService = {
  create,
  getAll,
  findByProperty,
  updateSingle,
  deleteSingle,
};
