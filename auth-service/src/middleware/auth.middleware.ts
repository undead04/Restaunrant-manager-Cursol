import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entities/user.entity";
import { ErrorResponse } from "../utils/Response.utils";
import { UserRepository } from "../repositories/user.repository";
import { EnumRole } from "../types/EnumRole";
interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json(ErrorResponse("Access token is required", null, 401));
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-super-secret-key"
    ) as JwtPayload;

    const userRepository = new UserRepository();
    const user = await userRepository.findById(decoded.userId);

    if (!user) {
      return res.status(401).json(ErrorResponse("User not found", null, 401));
    }

    if (!user.isActive) {
      return res.status(401).json(ErrorResponse("User is inactive", null, 401));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json(ErrorResponse("Invalid token", null, 401));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json(ErrorResponse("Token expired", null, 401));
    }
    return res
      .status(500)
      .json(ErrorResponse("Internal server error", null, 500));
  }
};
export const authorize = (allowedRoles: EnumRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json(ErrorResponse("Unauthorized", null, 401));
      }
      if (!allowedRoles.includes(req.user.role)) {
        return res
          .status(403)
          .json(
            ErrorResponse(
              "You don't have permission to access this resource",
              null,
              403
            )
          );
      }

      next();
    } catch (error) {
      return res
        .status(500)
        .json(ErrorResponse("Internal server error", null, 500));
    }
  };
};

// Tạo các helper functions để dễ sử dụng
export const adminOnly = authorize([EnumRole.Admin]);
export const cashierOnly = authorize([EnumRole.Admin, EnumRole.Cashier]);
export const kitchenOnly = authorize([EnumRole.Admin, EnumRole.Kitchen]);
export const waiterOnly = authorize([EnumRole.Admin, EnumRole.Waiter]);
