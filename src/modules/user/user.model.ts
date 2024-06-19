import bcrypt from "bcrypt";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import mongoose, { Schema, model } from "mongoose";
import config from "../../config";
import AppError from "../../errors/AppError";
import { userRoles } from "./user.constant";
import { TUser, UserModel } from "./user.interface";

const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: [true, "email is required"],
      validate: {
        validator: async function (email: string): Promise<boolean> {
          const user = await User.findOne({ email });
          return !user;
        },
        message: "Email already exists",
      },
    },
    role: {
      type: String,
      enum: {
        values: userRoles,
        message: "{VALUE} is not a valid user role",
      },
      required: [true, "role is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "password must be at least 6 characters"],
      select: 0,
    },
    phone: {
      type: String,
      trim: true,
      required: [true, "phone is required"],
    },
    address: {
      type: String,
      trim: true,
      required: [true, "address is required"],
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
