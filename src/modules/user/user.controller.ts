import httpStatus from "http-status";
import { catchAsync, sendResponse } from "../../utils";
import { userService } from "./user.service";

// change user status
const changeStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedUser = await userService.changeStatus(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User status updated successfully",
    data: updatedUser,
  });
});

// make an existing user admin
const makeAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedUser = await userService.makeAdmin(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User updated to admin successfully",
    data: updatedUser,
  });
});

// get all users
const allUsers = catchAsync(async (req, res) => {
  const { meta, result } = await userService.getAllUsers(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User updated to admin successfully",
    meta,
    data: result,
  });
});

export const userController = {
  changeStatus,
  makeAdmin,
  allUsers,
};
