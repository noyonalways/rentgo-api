import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../builder";
import { AppError } from "../../errors";
import Car from "../car/car.model";
import { carService } from "../car/car.service";
import { userService } from "../user/user.service";
import { BOOKING_STATUS } from "./booking.constant";
import { TBooking } from "./booking.interface";
import Booking from "./booking.model";

// book a car
const newBooking = async (
  userData: JwtPayload,
  payload: Pick<TBooking, "car" | "bookingDate" | "startTime">,
) => {
  const user = await userService.findByProperty("email", userData.email);
  if (!user) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  const car = await carService.findByProperty("_id", payload.car.toString());
  if (!car) {
    throw new AppError("Car not found", httpStatus.NOT_FOUND);
  }
  if (car.status !== "available") {
    throw new AppError(
      "Car is not available right now",
      httpStatus.BAD_REQUEST,
    );
  }

  const modifiedObj = {
    ...payload,
    user: user?._id,
    car: car?._id,
  };

  const session = await Booking.startSession();

  try {
    session.startTransaction();

    const updatedCar = await Car.findByIdAndUpdate(
      payload.car.toString(),
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
const getAllBookings = async (query: Record<string, unknown>) => {
  const bookingQuery = new QueryBuilder(
    Booking.find({}).populate("user").populate("car"),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await bookingQuery.modelQuery;
  const meta = await bookingQuery.countTotal();

  return { result, meta };
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
    Booking.find({ user: user._id }).populate("user").populate("car"),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userBookingQuery.modelQuery;
  const meta = await userBookingQuery.countTotal();

  return { result, meta };
};

// approved booking
const approvedBooking = async (id: string) => {
  const updatedBooking = await Booking.findByIdAndUpdate(
    id,
    { status: BOOKING_STATUS.APPROVED },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedBooking) {
    throw new AppError("Booking not found", httpStatus.NOT_FOUND);
  }

  return updatedBooking;
};

// cancelled booking
const cancelledBooking = async (id: string) => {
  const updatedBooking = await Booking.findByIdAndUpdate(
    id,
    { status: BOOKING_STATUS.CANCELLED },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedBooking) {
    throw new AppError("Booking not found", httpStatus.NOT_FOUND);
  }

  return updatedBooking;
};

export const bookingService = {
  newBooking,
  getAllBookings,
  getUserBookings,
  approvedBooking,
  cancelledBooking,
};
