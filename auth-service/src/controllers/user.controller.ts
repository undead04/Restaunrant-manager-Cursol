import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";
import { UserFilter } from "../repositories/user.repository";
import { plainToInstance } from "class-transformer";
import {
  UpdatePasswordInput,
  UpdateUserInput,
  UserInput,
} from "../models/UserInput";
import { ErrorResponse, SuccessResponse } from "../utils/Response.utils";
import AppValidate from "../utils/AppValidate.utils";
import { ExportService } from "../services/export.service";

export class UserController {
  private userService: UserService;
  private exportService: ExportService;

  constructor() {
    this.userService = new UserService();
    this.exportService = new ExportService();
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: UserFilter = req.query;
      const users = await this.userService.getAllUsers(filters);
      return res
        .status(200)
        .json(SuccessResponse("Get all users successfully", users, 200));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const user = await this.userService.getUserById(id);
      if (!user) {
        return res.status(404).json(ErrorResponse("User not found", null, 404));
      }
      return res
        .status(200)
        .json(SuccessResponse("Get user by id successfully", user, 200));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id; // Assuming user info is attached by auth middleware
      if (!userId) {
        return res.status(401).json(ErrorResponse("Unauthorized", null, 401));
      }
      const user = await this.userService.getUserById(userId);
      if (!user) {
        return res.status(404).json(ErrorResponse("User not found", null, 404));
      }
      return res
        .status(200)
        .json(SuccessResponse("Get profile successfully", user, 200));
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const updateData = plainToInstance(UpdateUserInput, req.body);
      const result = await AppValidate(updateData);
      if (result) {
        return res.status(400).json(result);
      }
      const user = await this.userService.updateUser(id, updateData);
      if (!user) {
        return res.status(404).json(ErrorResponse("User not found", null, 404));
      }
      return res
        .status(200)
        .json(SuccessResponse("Update user successfully", user, 200));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const result = await this.userService.deleteUser(id);
      if (!result) {
        return res.status(404).json(ErrorResponse("User not found", null, 404));
      }
      return res
        .status(200)
        .json(SuccessResponse("User deleted successfully", null, 200));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const updateData = plainToInstance(UpdatePasswordInput, req.body);
      const result = await AppValidate(updateData);
      if (result) {
        return res.status(400).json(result);
      }
      const user = await this.userService.updatePassword(id, updateData);
      if (!user) {
        return res.status(404).json(ErrorResponse("User not found", null, 404));
      }
      return res
        .status(200)
        .json(SuccessResponse("Update password successfully", user, 200));
    } catch (error) {
      next(error);
    }
  }
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const models = plainToInstance(UserInput, req.body);
      const result = await AppValidate(models);
      if (result) {
        return res.status(400).json(result);
      }
      const user = await this.userService.createUser(models);
      if (!user) {
        return res
          .status(400)
          .json(ErrorResponse("User already exists", null, 400));
      }
      return res
        .status(201)
        .json(SuccessResponse("Create user successfully", user, 201));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async deleteUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { ids } = req.body;

      // Validate input
      if (!Array.isArray(ids)) {
        return res
          .status(400)
          .json(ErrorResponse("ids must be an array", null, 400));
      }

      if (ids.length === 0) {
        return res
          .status(400)
          .json(ErrorResponse("ids array cannot be empty", null, 400));
      }

      await this.userService.deleteUsers(ids);
      return res
        .status(200)
        .json(SuccessResponse("Users deleted successfully", null, 200));
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async exportUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.getAllUsers({});
      const buffer = await this.exportService.exportUsersToExcel(users.users);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");

      return res.send(buffer);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async importUsers(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json(ErrorResponse("No file uploaded", null, 400));
      }

      const users = await this.exportService.parseExcelToUsers(req.file.buffer);
      const results = await this.userService.importUsers(users as UserInput[]);

      return res.status(200).json(
        SuccessResponse(
          "Users imported",
          {
            successCount: results.success.length,
            errorCount: results.errors.length,
            errors: results.errors,
          },
          200
        )
      );
    } catch (error) {
      next(error);
    }
  }
}
