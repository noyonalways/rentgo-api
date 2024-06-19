import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { carService } from "./car.service";

const create = catchAsync(async (req, res) => {
  const result = await carService.create(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Car created successfully",
    data: result,
  });
});

const getAll = catchAsync(async (req, res) => {
  const result = await carService.getAll();

  if (result.length <= 0) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: "No Data found",
      data: result,
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Cars retrieved successfully",
    data: result,
  });
});

const getSingle = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await carService.findByProperty("_id", id);

  if (!result) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: "No Data found",
      data: undefined,
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "A Car retrieved successfully",
    data: result,
  });
});

const updateSingle = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await carService.updateSingle(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Car updated successfully",
    data: result,
  });
});

const deleteSingle = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await carService.deleteSingle(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Car deleted successfully",
    data: result,
  });
});

const returnTheCar = catchAsync(async (req, res) => {
  const result = await carService.returnTheCar(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Car returned successfully",
    data: result,
  });
});

export const carController = {
  create,
  getAll,
  getSingle,
  updateSingle,
  deleteSingle,
  returnTheCar,
};
