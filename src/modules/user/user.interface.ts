export type TUserRole = "user" | "admin";

export type TUser = {
  name: string;
  email: string;
  role: TUserRole;
  password: string;
  phone: string;
  address: string;
};
