import httpStatus from "http-status";
import config from "../../config";
import { catchAsync, sendResponse } from "../../utils";
import { paymentService } from "./payment.service";

const payPayment = catchAsync(async (req, res) => {
  const result = await paymentService.payPayment(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment initiate successfully",
    data: result,
  });
});

const getAllPayments = catchAsync(async (req, res) => {
  const { meta, result } = await paymentService.getAllPayments(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payments retrieved successfully",
    meta,
    data: result,
  });
});

// get total revenue
const getTotalRevenue = catchAsync(async (req, res) => {
  const result = await paymentService.getTotalRevenue();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payments retrieved successfully",
    data: result,
  });
});

const paymentConfirmation = catchAsync(async (req, res) => {
  const { transactionId } = req.query;

  // verify the transaction
  const result = await paymentService.paymentConfirmation(
    transactionId as string,
  );

  if (result) {
    return res
      .status(200)
      .redirect(
        `${config.client_base_url}/booking/payment/success?transactionId=${transactionId}`,
      );
  } else {
    res
      .status(400)
      .redirect(
        `${config.client_base_url}/booking/payment/failed?transactionId=${transactionId}`,
      );
  }
});

const paymentFailed = catchAsync(async (req, res) => {
  const { transactionId } = req.query;

  // update the booking paymentStatus and  payment status
  await paymentService.paymentFailed(transactionId as string);

  res
    .status(200)
    .redirect(
      `${config.client_base_url}/booking/payment/failed?transactionId=${transactionId}`,
    );
});

const paymentCancelled = catchAsync(async (req, res) => {
  const { transactionId } = req.query;

  // update the booking paymentStatus and  payment status
  await paymentService.paymentCancelled(transactionId as string);

  res
    .status(200)
    .redirect(
      `${config.client_base_url}/booking/payment/cancel?transactionId=${transactionId}`,
    );
});

const userPayments = catchAsync(async (req, res) => {
  const { meta, result } = await paymentService.userPayments(
    req.user,
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User payments retrieved successfully",
    meta,
    data: result,
  });
});

export const paymentController = {
  payPayment,
  paymentConfirmation,
  paymentFailed,
  paymentCancelled,
  userPayments,
  getAllPayments,
  getTotalRevenue,
};
