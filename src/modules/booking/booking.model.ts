import { Schema, model } from "mongoose";
import { TBooking } from "./booking.interface";

const bookingSchema = new Schema<TBooking>(
  {
    date: {
      type: Date,
      required: [true, "date is required"],
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
    startTime: {
      type: String,
      required: [true, "startTime is required"],
    },
    endTime: {
      type: String,
      default: null,
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
