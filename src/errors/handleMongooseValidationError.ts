import mongoose from "mongoose";
import { TGenericErrorResponse } from "../interface/error";

const handleMongooseValidationError = (
  error: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errorMessages = Object.values(error.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val.path,
        message: val.message,
      };
    },
  );

  const statusCode = 400;

  return {
    statusCode,
    message: "Validation Error",
    errorMessages,
  };
};

export default handleMongooseValidationError;
