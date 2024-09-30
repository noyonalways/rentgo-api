import { Schema, model } from "mongoose";
import {
  PaymentCurrency,
  PaymentMethods,
  PaymentStatus,
} from "./payment.constant";
import { TPayment } from "./payment.interface";

const paymentSchema = new Schema<TPayment>(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    transactionId: {
      type: String,
      required: [true, "Transaction ID is required"],
    },
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking Id is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User Id is required"],
    },
    currency: {
      type: String,
      enum: {
        values: PaymentCurrency,
        message: "{VALUE} is not a valid currency",
      },
      default: "BDT",
    },
    paidAt: {
      type: Date,
      default: null,
    },
    paymentMethod: {
      type: String,
      enum: {
        values: PaymentMethods,
        message: "{VALUE} is not a valid currency",
      },
    },
    status: {
      type: String,
      enum: {
        values: PaymentStatus,
        message: "{VALUE} is not a valid status",
      },
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

const Payment = model<TPayment>("Payment", paymentSchema);
export default Payment;
