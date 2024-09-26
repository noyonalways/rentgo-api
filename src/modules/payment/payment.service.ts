import httpStatus from "http-status";
import { AppError } from "../../errors";
import Booking from "../booking/booking.model";
import User from "../user/user.model";
import { PAYMENT_STATUS } from "./payment.constant";
import { TPayment } from "./payment.interface";
import Payment from "./payment.model";
import {
  generateUniqueTransactionId,
  initiatePayment,
  verifyPayment,
} from "./payment.utils";

const payPayment = async (payload: TPayment) => {
  const currentBooking = await Booking.findById(payload.booking);
  if (!currentBooking) {
    throw new AppError("Booking not found", httpStatus.NOT_FOUND);
  }

  const user = await User.findById(currentBooking.user);
  if (!user) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  const transactionId = await generateUniqueTransactionId();

  // initiate payment
  const checkoutDetails = await initiatePayment({
    customerName: user.name,
    customerEmail: user.email,
    customerPhone: user.phone,
    address: user.address,
    amount: currentBooking.totalCost.toString(),
    currency: payload.currency,
    transactionId: transactionId,
  });

  const session = await Payment.startSession();

  try {
    session.startTransaction();

    const payment = await Payment.create(
      [{ ...payload, amount: currentBooking.totalCost, transactionId }],
      { session },
    );

    if (payment.length < 0) {
      throw new AppError("Filed to initiate payment", httpStatus.BAD_REQUEST);
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      currentBooking._id,
      { transactionId },
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!updatedBooking) {
      throw new AppError("Filed to initiate payment", httpStatus.BAD_REQUEST);
    }

    await session.commitTransaction();
    session.endSession();

    return checkoutDetails;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const paymentConfirmation = async (transactionId: string) => {
  const existingPayment = await Payment.findOne({ transactionId });
  if (!existingPayment) {
    throw new AppError("Payment not found", httpStatus.NOT_FOUND);
  }

  // check already paid or not
  if (existingPayment?.status === "paid") {
    throw new AppError("Payment already paid", httpStatus.BAD_REQUEST);
  }

  // verify the transaction to the payment gateway
  const verifyResponse = await verifyPayment(transactionId);

  if (verifyResponse?.pay_status === "Successful") {
    const session = await Payment.startSession();

    try {
      session.startTransaction();

      // update the payment model status
      const updatedPayment = await Payment.findOneAndUpdate(
        { transactionId: transactionId },
        { status: PAYMENT_STATUS.PAID, paidAt: new Date() },
        {
          session,
          runValidators: true,
        },
      );

      if (!updatedPayment) {
        throw new AppError("Filed to complete payment", httpStatus.BAD_REQUEST);
      }

      // update the booking model paymentStatus
      const updatedBooking = await Booking.findOneAndUpdate(
        { transactionId: transactionId },
        {
          paymentStatus: PAYMENT_STATUS.PAID,
        },
        {
          session,
          runValidators: true,
        },
      );

      if (!updatedBooking) {
        throw new AppError("Filed to complete payment", httpStatus.BAD_REQUEST);
      }

      await session.commitTransaction();
      session.endSession();

      return true;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  } else {
    return false;
  }
};

const paymentFailed = async (transactionId: string) => {
  const existingPayment = await Payment.findOne({ transactionId });
  if (!existingPayment) {
    throw new AppError("Payment not found", httpStatus.NOT_FOUND);
  }

  const session = await Payment.startSession();

  try {
    session.startTransaction();

    // update the payment model status
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: transactionId },
      { status: PAYMENT_STATUS.FAILED },
      {
        session,
        runValidators: true,
      },
    );

    if (!updatedPayment) {
      throw new AppError("Filed to update payment", httpStatus.BAD_REQUEST);
    }

    // update the booking model paymentStatus
    const updatedBooking = await Booking.findOneAndUpdate(
      { transactionId: transactionId },
      {
        paymentStatus: PAYMENT_STATUS.FAILED,
      },
      {
        session,
        runValidators: true,
      },
    );

    if (!updatedBooking) {
      throw new AppError("Filed to update payment", httpStatus.BAD_REQUEST);
    }

    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const paymentCancelled = async (transactionId: string) => {
  const existingPayment = await Payment.findOne({ transactionId });
  if (!existingPayment) {
    throw new AppError("Payment not found", httpStatus.NOT_FOUND);
  }

  const session = await Payment.startSession();

  try {
    session.startTransaction();

    // update the payment model status
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: transactionId },
      { status: PAYMENT_STATUS.CANCELLED },
      {
        session,
        runValidators: true,
      },
    );

    if (!updatedPayment) {
      throw new AppError("Filed to update payment", httpStatus.BAD_REQUEST);
    }

    // update the booking model paymentStatus
    const updatedBooking = await Booking.findOneAndUpdate(
      { transactionId: transactionId },
      {
        paymentStatus: PAYMENT_STATUS.CANCELLED,
      },
      {
        session,
        runValidators: true,
      },
    );

    if (!updatedBooking) {
      throw new AppError("Filed to update payment", httpStatus.BAD_REQUEST);
    }

    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

export const paymentService = {
  payPayment,
  paymentConfirmation,
  paymentFailed,
  paymentCancelled,
};
