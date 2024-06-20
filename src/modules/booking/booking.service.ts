import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import QueryBuilder from "mongoose-dynamic-querybuilder";
import AppError from "../../errors/AppError";
import Car from "../car/car.model";
import { carService } from "../car/car.service";
import { userService } from "../user/user.service";
import Booking from "./booking.model";

// book a car
const book = async (userData: JwtPayload, payload: Record<string, string>) => {
  const user = await userService.findByProperty("email", userData.email);
  if (!user) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  const car = await carService.findByProperty("_id", payload.carId);
  if (!car) {
    throw new AppError("Car not found", httpStatus.NOT_FOUND);
  }
  if (car.status !== "available") {
    throw new AppError("Car is not available", httpStatus.BAD_REQUEST);
  }

  const modifiedObj = {
    ...payload,
    user: user?._id,
    car: car._id,
  };

  const session = await Booking.startSession();

  try {
    session.startTransaction();

    const updatedCar = await Car.findByIdAndUpdate(
      payload.carId,
      {
        status: "unavailable",
      },
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!updatedCar) {
      throw new AppError("Filed to create booking", httpStatus.BAD_REQUEST);
    }

    const createdBookings = await Booking.create([{ ...modifiedObj }], {
      session,
    });

    if (createdBookings.length < 0) {
      throw new AppError("Filed to create booking", httpStatus.BAD_REQUEST);
    }

    await session.commitTransaction();
    session.endSession();

    return (await createdBookings[0].populate("user")).populate("car");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// get all bookings
const getAllBookings = (query: Record<string, unknown>) => {
  const bookingQuery = new QueryBuilder(
    Booking.find({}).populate("user").populate("car"),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  return bookingQuery.modelQuery;
};

// get user's bookings
const getUserBookings = async (
  userData: JwtPayload,
  query: Record<string, unknown>,
) => {
  const user = await userService.findByProperty("email", userData.email);
  if (!user) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  const userBookingQuery = new QueryBuilder(
    Booking.find({}).populate("user").populate("car"),
    query,
  )
    .sort()
    .paginate()
    .fields();

  return userBookingQuery.modelQuery;
};

export const bookingService = {
  book,
  getAllBookings,
  getUserBookings,
};
