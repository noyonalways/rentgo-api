import httpStatus from "http-status";
import mongoose from "mongoose";
import { QueryBuilder } from "../../builder";
import { AppError } from "../../errors";
import { BOOKING_STATUS } from "../booking/booking.constant";
import Booking from "../booking/booking.model";
import { searchableFields } from "./car.constant";
import { TCar } from "./car.interface";
import Car from "./car.model";
// import { calculateTotalTime } from "./car.utils";

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

  const result = await carQuery.modelQuery;
  const meta = await carQuery.countTotal();

  return { result, meta };
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

// Helper function to calculate total hours between two DateTime objects
const calculateTotalHours = (startDate: Date, endDate: Date): number => {
  const diffInMilliseconds = endDate.getTime() - startDate.getTime();
  return diffInMilliseconds / (1000 * 60 * 60); // Convert milliseconds to hours
};

const returnTheCar = async (payload: {
  bookingId: string;
  returnDate: string;
  endTime: string;
}) => {
  const { bookingId, endTime, returnDate } = payload;

  // Fetch booking from database
  const existingBooking = await Booking.findById(bookingId);
  if (!existingBooking) {
    throw new AppError("Booking not found", httpStatus.NOT_FOUND);
  }

  const { bookingDate, startTime } = existingBooking;

  // Ensure startTime and bookingDate are valid
  if (!startTime || !bookingDate) {
    throw new AppError("Invalid booking data", httpStatus.BAD_REQUEST);
  }

  // Combine bookingDate and startTime into a single DateTime object
  const bookingDateTime = new Date(
    `${bookingDate.toISOString().split("T")[0]}T${startTime}:00Z`,
  );
  if (isNaN(bookingDateTime.getTime())) {
    throw new AppError("Invalid booking start time", httpStatus.BAD_REQUEST);
  }

  // Combine returnDate and endTime into a single DateTime object
  const returnDateTime = new Date(`${returnDate}T${endTime}:00Z`);
  if (isNaN(returnDateTime.getTime())) {
    throw new AppError("Invalid return time", httpStatus.BAD_REQUEST);
  }

  // Validate the return date and time
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to midnight for today's date comparison

  // Ensure the return date is not before booking date or today
  if (returnDateTime < bookingDateTime || returnDateTime < today) {
    throw new AppError(
      "Return date must be today, booking date, or a future date",
      httpStatus.BAD_REQUEST,
    );
  }

  // Ensure that the endTime is after the startTime if the returnDate is the same as bookingDate
  if (
    returnDateTime.toDateString() === bookingDateTime.toDateString() &&
    returnDateTime <= bookingDateTime
  ) {
    throw new AppError(
      "End time must be after the booking start time",
      httpStatus.BAD_REQUEST,
    );
  }

  // Fetch the car details
  const car = await Car.findById(existingBooking.car);
  if (!car) {
    throw new AppError("Car not found", httpStatus.NOT_FOUND);
  }

  // Calculate total hours and total cost
  const totalHours = calculateTotalHours(bookingDateTime, returnDateTime);
  if (totalHours < 0) {
    throw new AppError("Return time is invalid", httpStatus.BAD_REQUEST);
  }

  const totalCost = car.pricePerHour * totalHours;

  // Process return (transaction)
  const session = await Booking.startSession();
  try {
    session.startTransaction();

    // Update the car status to "available"
    await Car.findByIdAndUpdate(car._id, { status: "available" }, { session });

    // Update booking with the calculated totalCost and endTime
    const updatedBooking = await Booking.findByIdAndUpdate(
      existingBooking._id,
      {
        totalHours,
        totalCost,
        endTime,
        returnDate,
        status: BOOKING_STATUS.COMPLETED,
      },
      { session, new: true },
    );

    if (!updatedBooking) {
      throw new AppError("Failed to update booking", httpStatus.BAD_REQUEST);
    }

    await session.commitTransaction();
    session.endSession();

    return updatedBooking;
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
