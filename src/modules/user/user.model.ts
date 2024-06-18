import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";
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
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = model<TUser>("User", userSchema);
export default User;
