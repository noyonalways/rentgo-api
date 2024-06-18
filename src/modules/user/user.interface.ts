import { JwtPayload } from "jsonwebtoken";
import { Document, Model } from "mongoose";

export type TUserRole = "user" | "admin";

export type TUser = {
  name: string;
  email: string;
  role: TUserRole;
  password: string;
  phone: string;
  address: string;
};

export interface UserModel extends Model<TUser> {
  isUserExists(key: string, value: string): Promise<TUser & Document>;
  isPasswordMatch(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  createToken(
    jwtPayload: JwtPayload,
    secret: string,
    expiresIn: string,
  ): string;
}
