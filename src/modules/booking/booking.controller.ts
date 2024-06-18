import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { bookingService } from "./booking.service";

// book a car
const book = catchAsync(async (req, res) => {
  const result = await bookingService.book(req.user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Booking created successfully",
    data: result,
  });
});

// get all bookings
const getAllBookings = catchAsync(async (req, res) => {
  const result = await bookingService.getAllBookings();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bookings fetched successfully",
    data: result,
  });
});

// get user's booking
const getUserBookings = catchAsync(async (req, res) => {
  const result = await bookingService.getUserBookings(req.user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bookings fetched successfully",
    data: result,
  });
});

export const bookingController = {
  book,
  getAllBookings,
  getUserBookings,
};
