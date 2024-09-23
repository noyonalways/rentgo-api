import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import { ZodError } from "zod";
import config from "../config";
import AppError from "../errors/AppError";
import handleMongooseDuplicateIdError from "../errors/handleMongooseDuplicateIdError";
import handleMongooseValidationError from "../errors/handleMongooseValidationError";
import handleZodError from "../errors/handleZodError";
import { TErrorMessages } from "../interface/error";

const notFound = (_req: Request, res: Response, _next: NextFunction) => {
  const err = new AppError("Api Not Found", 404);
  res.status(err.statusCode).json({
    success: false,
    statusCode: err.statusCode,
    message: err.message,
  });
};

const global: ErrorRequestHandler = (error, _req, res, _next) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errorMessages: TErrorMessages = [
    {
      path: "",
      message: "Something went wrong",
    },
  ];

  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);

    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error?.name === "ValidationError") {
    const simplifiedError = handleMongooseValidationError(error);

    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error?.code === 11000) {
    const simplifiedError = handleMongooseDuplicateIdError(error);

    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof JsonWebTokenError) {
    statusCode = 401;
    message = error.name;
    errorMessages = [
      {
        path: "",
        message: error.message,
      },
    ];
  } else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errorMessages = [
      {
        path: "",
        message: error.message,
      },
    ];
  } else if (error instanceof Error) {
    message = error.message;
    errorMessages = [
      {
        path: "",
        message: error.message,
      },
    ];
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.NODE_ENV === "development" ? error.stack : null,
    // error,
  });
};

export const errorHandler = {
  notFound,
  global,
};
