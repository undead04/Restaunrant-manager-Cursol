import { NextFunction, Response, Request } from "express";
import CustomError from "../models/CustomeError";
import { ErrorResponse } from "../utils/Response.utils";
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Kiểm tra nếu err là một CustomError
  if (err instanceof CustomError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.field);

    if (err.field) {
      res
        .status(err.statusCode || 422)
        .json(
          ErrorResponse(
            err.message,
            { [err.field]: err.message },
            err.statusCode
          )
        );
    } else {
      res
        .status(err.statusCode || 422)
        .json(ErrorResponse(err.message, null, err.statusCode));
    }
    return;
  }

  // Kiểm tra nếu err là một Error chuẩn
  if (err instanceof Error) {
    console.error("Internal Server Error:", err.message);
    res.status(500).json(ErrorResponse("Internal Server Error", null, 500));
    return;
  }

  // Trường hợp lỗi không xác định
  res.status(500).json(ErrorResponse("Unknown Error", null, 500));
};
