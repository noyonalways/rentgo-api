import { Schema, model } from "mongoose";
import { BookingPaymentStatus, BookingStatus } from "./booking.constant";
import { TBooking } from "./booking.interface";

const bookingSchema = new Schema<TBooking>(
  {
    bookingDate: {
      type: Date,
      required: [true, "Booking date is required"],
    },
    returnDate: {
      type: Date,
      default: null,
    },
    startTime: {
      type: String,
      required: [true, "startTime is required"],
    },
    endTime: {
      type: String,
      default: null,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    car: {
      type: Schema.Types.ObjectId,
      ref: "Car",
      required: [true, "car is required"],
    },
    bookingAddress: {
      type: String,
      required: [true, "Booking address is required"],
    },
    nidOrPassport: {
      type: String,
      required: [true, "Nid or Passport number is required"],
    },
    drivingLicense: {
      type: String,
      required: [true, "Driving license number is required"],
    },
    status: {
      type: String,
      enum: {
        values: BookingStatus,
        message: "{VALUE} is not a valid booking status",
      },
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: {
        values: BookingPaymentStatus,
        message: "{VALUE} is not a valid booking payment status",
      },
      default: "pending",
    },
    transactionId: {
      type: String,
    },
    totalHours: {
      type: Number,
      default: 0,
    },
    totalCost: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Booking = model<TBooking>("Booking", bookingSchema);
export default Booking;
