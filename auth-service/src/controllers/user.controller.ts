import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";
import { User } from "../entities/user.entity";
import { UserFilter } from "../repositories/user.repository";
import { plainToInstance } from "class-transformer";
import { UpdatePasswordInput, UserInput } from "../models/UserInput";
import { validate } from "class-validator";
export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: UserFilter = req.query;
      const users = await this.userService.getAllUsers(filters);
      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const user = await this.userService.getUserById(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id; // Assuming user info is attached by auth middleware
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await this.userService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const updateData = req.body as Partial<User>;

      const user = await this.userService.updateUser(id, updateData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const result = await this.userService.deleteUser(id);

      if (!result) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const updateData = plainToInstance(UpdatePasswordInput, req.body);
      const errors = await validate(updateData);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      const user = await this.userService.updatePassword(id, updateData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const models = plainToInstance(UserInput, req.body);
      const errors = await validate(models);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      const user = await this.userService.createUser(models);
      if (!user) {
        return res.status(400).json({ message: "User already exists" });
      }
      return res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
}
