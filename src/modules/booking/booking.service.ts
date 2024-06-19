import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import Car from "../car/car.model";
import { carService } from "../car/car.service";
import { userService } from "../user/user.service";
import { TBooking } from "./booking.interface";
import Booking from "./booking.model";

// book a car
const book = async (userData: JwtPayload, payload: TBooking) => {
  const user = await userService.findByProperty("email", userData.email);
  if (!user) {
    throw new AppError("No Data found", httpStatus.NOT_FOUND);
  }

  const car = await carService.findByProperty("_id", payload.car.toString());
  if (!car) {
    throw new AppError("No Data found", httpStatus.NOT_FOUND);
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
      payload.car,
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

/**
 * TODO: Query Parameters
 * - carId: ID of the car for which availability needs to be checked.
 * - date: The specific date for which availability needs to be checked (format: YYYY-MM-DD).
 */
// get all bookings
const getAllBookings = () => {
  return Booking.find().populate("user").populate("car");
};

// get user's bookings
const getUserBookings = async (userData: JwtPayload) => {
  const user = await userService.findByProperty("email", userData.email);
  if (!user) {
    throw new AppError("No Data found", httpStatus.NOT_FOUND);
  }

  return Booking.find({ user: user._id }).populate("user").populate("car");
};

export const bookingService = {
  book,
  getAllBookings,
  getUserBookings,
};
