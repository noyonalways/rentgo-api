import { JwtPayload } from "jsonwebtoken";
import { TBooking } from "./booking.interface";
import Booking from "./booking.model";

// book a car
const book = (userData: JwtPayload, payload: TBooking) => {
  console.log({ payload, userData });
};

// get all bookings
const getAllBookings = () => {
  return Booking.find();
};

// get user's bookings
const getUserBookings = (userData: JwtPayload) => {
  console.log({ userData });
};

export const bookingService = {
  book,
  getAllBookings,
  getUserBookings,
};
