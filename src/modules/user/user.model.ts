import bcrypt from "bcrypt";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import mongoose, { model, Schema } from "mongoose";
import config from "../../config";
import AppError from "../../errors/AppError";
import { UserRoles, UserStatus } from "./user.constant";
import { TUser, UserModel } from "./user.interface";

const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: [true, "Email is required"],
    },
    phone: {
      type: String,
      trim: true,
      required: [true, "Phone is required"],
    },
    profileImage: {
      type: String,
      trim: true,
      default: "",
    },
    role: {
      type: String,
      enum: {
        values: UserRoles,
        message: "{VALUE} is not a valid user role",
      },
      default: "user",
      required: [true, "Role is required"],
    },
    status: {
      type: String,
      enum: {
        values: UserStatus,
        message: "{VALUE} is not a valid user status",
      },
      default: "active",
      required: [true, "Status is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: 0,
    },
    dateOfBirth: {
      type: Date,
      trim: true,
      required: [true, "Date of birth is required"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    nidOrPassport: {
      type: String,
      trim: true,
      default: "",
    },
    drivingLicense: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      type: String,
      trim: true,
      required: [true, "Address is required"],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

// user statics methods
userSchema.statics.isUserExists = function (key: string, value: string) {
  if (key === "_id") {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new AppError("Provide a valid object Id", httpStatus.BAD_REQUEST);
    }
    return User.findById(value).select("+password");
  }
  return User.findOne({ [key]: value }).select("+password");
};

userSchema.statics.isPasswordMatch = function (
  plainTextPassword: string,
  hashedPassword,
) {
  return bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.createToken = function (
  jwtPayload: { email: string; role: string },
  secret: string,
  expiresIn: string,
) {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

const User = model<TUser, UserModel>("User", userSchema);
export default User;
