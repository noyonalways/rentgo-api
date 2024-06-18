import { ZodError } from "zod";
import { TErrorMessages, TGenericErrorResponse } from "../interface/error";

const handleZodError = (error: ZodError): TGenericErrorResponse => {
  const errorMessages: TErrorMessages = error.issues.map((issue) => {
    return {
      path: issue.path.slice(1).join(".") || issue.path[0],
      message: issue.message,
    };
  });

  const statusCode = 400;
  return {
    statusCode,
    message: "Validation Error",
    errorMessages,
  };
};

export default handleZodError;
