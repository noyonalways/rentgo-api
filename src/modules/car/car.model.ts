import { Schema, model } from "mongoose";
import { carStatus } from "./car.constant";
import { TCar } from "./car.interface";

const carSchema = new Schema<TCar>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name is required"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "description is required"],
      minlength: [20, "description must be less than 20 characters"],
    },
    color: {
      type: String,
      trim: true,
      required: [true, "color is required"],
    },
    isElectric: {
      type: Boolean,
      required: [true, "isElectric is required"],
    },
    features: {
      type: [String],
      required: [true, "features is required"],
    },
    pricePerHour: {
      type: Number,
      required: [true, "pricePerHour is required"],
    },
    status: {
      type: String,
      enum: {
        values: carStatus,
        message: "{VALUE} is not a valid car status",
      },
      default: "available",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Car = model<TCar>("Car", carSchema);
export default Car;
