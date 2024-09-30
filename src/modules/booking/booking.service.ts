import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../builder";
import { AppError } from "../../errors";
import { CAR_STATUS } from "../car/car.constant";
import Car from "../car/car.model";
import { carService } from "../car/car.service";
import User from "../user/user.model";
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
        status: CAR_STATUS.UNAVAILABLE,
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

// get logged in user's bookings
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

// get single booking by transaction id
const getBookingByTransactionId = async (
  user: Record<string, unknown>,
  transactionId: string,
) => {
  const currentUser = await User.findOne({ email: user.email });

  if (!currentUser) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  const currentUserBookings = Booking.find({ user: currentUser._id });

  const booking = await currentUserBookings
    .findOne({ transactionId, user: currentUser._id })
    .populate("user")
    .populate("car");
  if (!booking) {
    throw new AppError("Booking not found", httpStatus.NOT_FOUND);
  }

  return booking;
};

const cancelLoggedInUserBooking = async (
  user: Record<string, unknown>,
  bookingId: string,
) => {
  const currentUser = await User.findOne({ email: user.email });

  if (!currentUser) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new AppError("Booking not found", httpStatus.NOT_FOUND);
  }

  if (booking?.status === "approved") {
    throw new AppError("Booking is already approved", httpStatus.BAD_REQUEST);
  }

  if (booking?.status === "cancelled") {
    throw new AppError("Booking is already cancelled", httpStatus.BAD_REQUEST);
  }

  if (booking?.status === "completed") {
    throw new AppError("Booking is already completed", httpStatus.BAD_REQUEST);
  }

  const session = await Booking.startSession();

  try {
    session.startTransaction();

    const updatedCar = await Car.findByIdAndUpdate(
      booking?.car,
      {
        status: CAR_STATUS.AVAILABLE,
      },
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!updatedCar) {
      throw new AppError("Filed to delete booking", httpStatus.BAD_REQUEST);
    }

    const deletedBooking = await Booking.findByIdAndDelete(bookingId, {
      session,
    });

    if (!deletedBooking) {
      throw new AppError("Filed to delete booking", httpStatus.BAD_REQUEST);
    }

    await session.commitTransaction();
    session.endSession();

    return deletedBooking;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const updateLoggedInUserBooking = async (
  user: Record<string, unknown>,
  bookingId: string,
  payload: TBooking,
) => {
  // Find the current user by email
  const currentUser = await User.findOne({ email: user.email });

  if (!currentUser) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  const currentBooking = await Booking.findOne({
    _id: bookingId,
    user: currentUser._id,
  });

  if (!currentBooking) {
    throw new AppError("Booking not found", httpStatus.NOT_FOUND);
  }

  if (currentBooking?.status === "approved") {
    throw new AppError("Booking is already approved", httpStatus.BAD_REQUEST);
  }

  if (currentBooking?.status === "cancelled") {
    throw new AppError("Booking is already cancelled", httpStatus.BAD_REQUEST);
  }

  if (currentBooking?.status === "completed") {
    throw new AppError("Booking is already completed", httpStatus.BAD_REQUEST);
  }

  return Booking.findByIdAndUpdate(currentBooking._id, payload, {
    new: true,
    runValidators: true,
  });
};

export const bookingService = {
  newBooking,
  getAllBookings,
  getUserBookings,
  approvedBooking,
  cancelledBooking,
  getBookingByTransactionId,
  cancelLoggedInUserBooking,
  updateLoggedInUserBooking,
};
