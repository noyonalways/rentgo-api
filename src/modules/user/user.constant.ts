import { TUserRoles } from "./user.interface";

export const userRoles: TUserRoles[] = ["admin", "user"];

export const USER_ROLE = {
  admin: "admin",
  user: "user",
} as const;
