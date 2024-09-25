import { Schema, model } from "mongoose";
import { carMileageUnit, carStatus, carTransMission } from "./car.constant";
import { TCar, TGalleryImage } from "./car.interface";

const galleryImageSchema = new Schema<TGalleryImage>({
  url: { type: String },
});

const carSchema = new Schema<TCar>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Description is required"],
      minlength: [20, "Description must be grater than 20 characters"],
    },
    image: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
      required: [true, "Brand is required"],
    },
    model: {
      type: String,
      trim: true,
      required: [true, "Model is required"],
    },
    type: {
      type: String,
      trim: true,
      required: [true, "Type is required"],
    },
    category: {
      type: String,
      trim: true,
      required: [true, "Category is required"],
    },
    year: {
      type: String,
      required: [true, "Year is required"],
    },
    color: {
      type: String,
      trim: true,
      required: [true, "Color is required"],
    },
    seatCapacity: {
      type: Number,
      required: [true, "Seat capacity is required"],
    },
    mileage: {
      type: Number,
      required: [true, "Mileage is required"],
    },
    mileageUnit: {
      type: String,
      enum: {
        values: carMileageUnit,
        message: "{VALUE} is not a valid car status",
      },
      default: "kilometers",
    },
    isElectric: {
      type: Boolean,
      required: [true, "Is Electric is required"],
    },
    galleryImages: {
      type: [galleryImageSchema],
      default: [],
    },
    features: {
      type: [String],
      required: [true, "Features is required"],
    },
    pricePerHour: {
      type: Number,
      required: [true, "Price per hour is required"],
    },
    transmission: {
      type: String,
      enum: {
        values: carTransMission,
        message: "{VALUE} is not a valid car status",
      },
      required: [true, "Transmission is required"],
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

carSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

carSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

carSchema.pre("findOneAndUpdate", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

const Car = model<TCar>("Car", carSchema);
export default Car;
