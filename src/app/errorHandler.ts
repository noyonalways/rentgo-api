import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import config from "../config";
import AppError from "../errors/AppError";
import { TErrorMessages } from "../interface/error";

const notFound = (_req: Request, res: Response, _next: NextFunction) => {
  const err = new AppError("Not Found", 404);
  res.status(err.statusCode).json({
    success: false,
    statusCode: err.statusCode,
    message: err.message,
  });
};

const global: ErrorRequestHandler = (err, _req, res, _next) => {
  let statusCode = 500;
  let message = "something went wrong";
  let errorMessages: TErrorMessages = [
    {
      path: "",
      message: "something went wrong",
    },
  ];

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorMessages = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.NODE_ENV === "development" ? err.stack : null,
    err,
  });
};

export const errorHandler = {
  notFound,
  global,
};
