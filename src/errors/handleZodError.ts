import { ZodError } from "zod";
import { TErrorMessages, TGenericErrorResponse } from "../interface/error";

const handleZodError = (error: ZodError): TGenericErrorResponse => {
  const errorMessages: TErrorMessages = error.issues.map((issue) => ({
    path: issue.path[issue.path.length - 1],
    message: issue.message,
  }));

  const statusCode = 400;
  return {
    statusCode,
    message: "Validation Error",
    errorMessages,
  };
};

export default handleZodError;
