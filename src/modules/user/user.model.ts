import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";
import config from "../../config";
import { userRoles } from "./user.constant";
import { TUser } from "./user.interface";

const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "email is required"],
      validate: {
        validator: async function (email: string) {
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
    },
    phone: {
      type: String,
      required: [true, "phone is required"],
    },
    address: {
      type: String,
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

const User = model<TUser>("User", userSchema);
export default User;
