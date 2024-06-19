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
    message: "Car booked successfully",
    data: result,
  });
});

// get all bookings
const getAllBookings = catchAsync(async (req, res) => {
  const result = await bookingService.getAllBookings();

  if (result.length <= 0) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: "No Data found",
      data: result,
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bookings retrieved successfully",
    data: result,
  });
});

// get user's booking
const getUserBookings = catchAsync(async (req, res) => {
  const result = await bookingService.getUserBookings(req.user);

  if (result.length <= 0) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: "No Data found",
      data: result,
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My Bookings retrieved successfully",
    data: result,
  });
});

export const bookingController = {
  book,
  getAllBookings,
  getUserBookings,
};
