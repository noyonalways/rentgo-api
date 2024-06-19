import httpStatus from "http-status";
import mongoose from "mongoose";
import QueryBuilder from "mongoose-dynamic-querybuilder";
import AppError from "../../errors/AppError";
import Booking from "../booking/booking.model";
import { searchableFields } from "./car.constant";
import { TCar } from "./car.interface";
import Car from "./car.model";
import { calculateTotalTime } from "./car.utils";

// create a new car
const create = (payload: TCar) => {
  return Car.create(payload);
};

// get all cars
const getAll = async (query: Record<string, unknown>) => {
  const carQuery = new QueryBuilder(Car.find({}), query)
    .filter()
    .sort()
    .paginate()
    .fields()
    .search(searchableFields);

  return carQuery.modelQuery;
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
  const car = await findByProperty("_id", id);
  if (!car) {
    throw new AppError("Car not found", httpStatus.NOT_FOUND);
  }

  // check the car is booked or not then update
  if (car.status !== "available") {
    throw new AppError(
      "Can't Update, Car is already booked",
      httpStatus.BAD_REQUEST,
    );
  }

  const updatedCar = await Car.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedCar;
};

// delete a car
const deleteSingle = async (id: string) => {
  const car = await findByProperty("_id", id);
  if (!car) {
    throw new AppError("Car not found", httpStatus.NOT_FOUND);
  }

  // check the car is booked or not then delete
  if (car.status !== "available") {
    throw new AppError(
      "Can't delete, Car is already booked",
      httpStatus.BAD_REQUEST,
    );
  }

  const deletedCar = await Car.findByIdAndUpdate(
    id,
    { isDeleted: true, status: "unavailable" },
    {
      new: true,
      runValidators: true,
    },
  );

  return deletedCar;
};

// return the car
const returnTheCar = async (payload: {
  bookingId: string;
  endTime: string;
}) => {
  const { bookingId, endTime } = payload;

  // find the booking
  const existingBooking = await Booking.findById(bookingId);
  if (!existingBooking) {
    throw new AppError("Booking Data not found", httpStatus.NOT_FOUND);
  }

  // find the car
  const car = await Car.findById(existingBooking.car);
  if (!car) {
    throw new AppError("Car not found", httpStatus.NOT_FOUND);
  }

  // calculate total time and totalCost
  const totalTime = calculateTotalTime(existingBooking.startTime, endTime);
  const totalCost = car?.pricePerHour * totalTime;

  const session = await Booking.startSession();
  try {
    session.startTransaction();

    // transaction-1
    await Car.findByIdAndUpdate(
      car._id,
      {
        status: "available",
      },
      {
        session,
        runValidators: true,
      },
    );

    // transaction-2
    const updatedBooking = await Booking.findByIdAndUpdate(
      existingBooking._id,
      {
        totalCost,
        endTime,
      },
      {
        session,
        new: true,
        runValidators: true,
      },
    );

    if (!updatedBooking) {
      throw new AppError("Failed to Return The Car", httpStatus.BAD_REQUEST);
    }

    await session.commitTransaction();
    session.endSession();

    return (await updatedBooking.populate("user")).populate("car");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const carService = {
  create,
  getAll,
  findByProperty,
  updateSingle,
  deleteSingle,
  returnTheCar,
};
