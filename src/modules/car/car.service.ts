import httpStatus from "http-status";
import mongoose from "mongoose";
import { QueryBuilder } from "../../builder";
import { AppError } from "../../errors";
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

// Helper function to calculate the total hours between two dates
const calculateTotalTime = (startDateTime: Date, endDateTime: Date) => {
  const diffInMilliseconds = endDateTime.getTime() - startDateTime.getTime();
  const diffInHours = diffInMilliseconds / (1000 * 60 * 60); // Convert milliseconds to hours
  return Math.ceil(diffInHours); // Round up to the next full hour
};

const returnTheCar = async (payload: {
  bookingId: string;
  returnDate: string;
  endTime: string;
}) => {
  const { bookingId, endTime, returnDate } = payload;

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

  // Combine returnDate and endTime into a single Date object for return
  const returnDateTime = new Date(`${returnDate}T${endTime}:00`);

  // Combine bookingDate and startTime into a single Date object for start
  const bookingDateTime = new Date(
    `${existingBooking.bookingDate.toISOString().split("T")[0]}T${existingBooking.startTime}:00`,
  );

  // Calculate total time in hours (rounded up)
  const totalTime = calculateTotalTime(bookingDateTime, returnDateTime);

  // Calculate the total cost
  const totalCost = car.pricePerHour * totalTime;

  const session = await Booking.startSession();
  try {
    session.startTransaction();

    // transaction-1: Update the car status to "available"
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

    // transaction-2: Update the booking with totalCost and endTime
    const updatedBooking = await Booking.findByIdAndUpdate(
      existingBooking._id,
      {
        totalCost,
        totalHour: totalTime, // Save total hours
        endTime,
        returnDate, // Save the return date as well
        status: "completed",
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
