import httpStatus from "http-status";
import { catchAsync, sendResponse } from "../../utils";
import { userService } from "./user.service";

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

export const userController = {
  changeStatus,
};
