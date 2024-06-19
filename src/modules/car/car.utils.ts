import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import Booking from "../booking/booking.model";

export const startAndEndTimeValidation = async (
  body: Record<string, unknown>,
) => {
  // start time: 10:30 => 1970-01-01T10:30
  // end time: 12:30 => 1970-01-01T12:30
  const existingBooking = await Booking.findById(body.bookingId);
  if (!existingBooking) {
    throw new AppError("Booking Data not found", httpStatus.NOT_FOUND);
  }

  if (existingBooking.endTime) {
    throw new AppError("Car is already returned", httpStatus.BAD_REQUEST);
  }

  const start = new Date(`1970-01-01T${existingBooking?.startTime}:00`);
  const end = new Date(`1970-01-01T${body.endTime}:00`);
  return end > start;
};

export const calculateTotalTime = (startTime: string, endTime: string) => {
  const start = new Date(`1970-01-01T${startTime}:00`);
  const end = new Date(`1970-01-01T${endTime}:00`);
  return (Number(end) - Number(start)) / (3600 * 1000);
};
