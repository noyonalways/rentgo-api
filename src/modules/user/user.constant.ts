import { TUserRoles, TUserStatus } from "./user.interface";

export const UserRoles: TUserRoles[] = ["admin", "user"];
export const UserStatus: TUserStatus[] = ["active", "blocked"];

export const USER_ROLE = {
  admin: "admin",
  user: "user",
} as const;
