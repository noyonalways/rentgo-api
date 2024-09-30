import httpStatus from "http-status";
import { catchAsync, sendResponse } from "../../utils";
import { bookingService } from "./booking.service";

// book a car
const newBooking = catchAsync(async (req, res) => {
  const result = await bookingService.newBooking(req.user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message:
      "Car booking info submitted successfully, please wait for the approval",
    data: result,
  });
});

// get all bookings
const getAllBookings = catchAsync(async (req, res) => {
  const newQuery = { ...req.query };

  // modify the endTime field to filter the non returned bookings
  if (req.query.endTime) {
    delete newQuery.endTime;
    newQuery.endTime = null as unknown as string;
  }

  const { meta, result } = await bookingService.getAllBookings(newQuery);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bookings retrieved successfully",
    meta,
    data: result,
  });
});

// get logged in user's bookings
const getUserBookings = catchAsync(async (req, res) => {
  const newQuery = { ...req.query };

  // modify the endTime field to filter the non returned bookings
  if (req.query.endTime) {
    delete newQuery.endTime;
    newQuery.endTime = null as unknown as string;
  }

  const { meta, result } = await bookingService.getUserBookings(
    req.user,
    newQuery,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My Bookings retrieved successfully",
    meta,
    data: result,
  });
});

// approved booking
const approvedBooking = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await bookingService.approvedBooking(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking is approved",
    data: result,
  });
});

// cancelled booking
const cancelledBooking = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await bookingService.cancelledBooking(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking is cancelled",
    data: result,
  });
});

// get single booking by transaction id
const getBookingByTransactionId = catchAsync(async (req, res) => {
  const { transactionId } = req.params;
  const result = await bookingService.getBookingByTransactionId(
    req.user,
    transactionId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking retrieved successfully",
    data: result,
  });
});

const cancelLoggedInUserBooking = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await bookingService.cancelLoggedInUserBooking(req.user, id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking cancelled successfully",
    data: result,
  });
});

const updateLoggedInUserBooking = catchAsync(async (req, res) => {
  const result = await bookingService.updateLoggedInUserBooking(
    req.user,
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking updated successfully",
    data: result,
  });
});

export const bookingController = {
  newBooking,
  getAllBookings,
  getUserBookings,
  approvedBooking,
  cancelledBooking,
  getBookingByTransactionId,
  cancelLoggedInUserBooking,
  updateLoggedInUserBooking,
};
