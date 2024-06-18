import { TUser } from "../user/user.interface";
import User from "../user/user.model";
import { TUserSignIn } from "./auth.interface";

// sign up user
const singUp = (payload: TUser) => {
  return User.create(payload);
};

// sing in user
const singIn = (payload: TUserSignIn) => {};

export const authService = {
  singUp,
  singIn,
};
