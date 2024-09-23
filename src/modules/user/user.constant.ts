import { TUserRoles, TUserStatus } from "./user.interface";

export const userRoles: TUserRoles[] = ["admin", "user"];
export const userStatus: TUserStatus[] = ["active", "blocked"];

export const USER_ROLE = {
  admin: "admin",
  user: "user",
} as const;
