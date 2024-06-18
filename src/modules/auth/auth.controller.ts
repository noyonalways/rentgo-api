import catchAsync from "../../utils/catchAsync";
import User from "../user/user.model";

const signUp = catchAsync(async (req, res) => {
  // const { body } = req;
  // console.log(body);

  await User.create(req.body);
  res.end();
});

export const authController = {
  signUp,
};
