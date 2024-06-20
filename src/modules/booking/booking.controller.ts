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
  const newQuery = { ...req.query };
  if (req.query.carId) {
    delete newQuery.carId;
    newQuery.car = req.query.carId;
  }

  // modify the endTime field to filter the non returned bookings
  if (req.query.endTime) {
    req.query.endTime = null as unknown as string;
  }

  const result = await bookingService.getAllBookings(newQuery);

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
  const newQuery = { ...req.query };
  if (req.query.carId) {
    delete newQuery.carId;
    newQuery.car = req.query.carId;
  }

  // modify the endTime field to filter the user's current running booking
  if (req.query.endTime) {
    req.query.endTime = null as unknown as string;
  }

  const result = await bookingService.getUserBookings(req.user, req.query);

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
