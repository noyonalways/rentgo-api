import { Error } from "mongoose";
import { TErrorMessages, TGenericErrorResponse } from "../interface/error";

interface MongooseDuplicateKeyError extends Error {
  code: number;
  keyPattern: Record<string, unknown>;
  keyValue: Record<string, unknown>;
}

const handleMongooseDuplicateIdError = (
  error: MongooseDuplicateKeyError,
): TGenericErrorResponse => {
  const match = error?.message?.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];

  const statusCode = 400;
  const errorMessages: TErrorMessages = [
    {
      path: Object.keys(error?.keyPattern)[
        Object.keys(error?.keyPattern).length - 1
      ],
      message: `${extractedMessage} is already exists`,
    },
  ];

  return {
    statusCode,
    message: "Duplicate Entry",
    errorMessages,
  };
};

export default handleMongooseDuplicateIdError;
