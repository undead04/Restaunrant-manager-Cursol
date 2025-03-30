import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../repositories/user.repository";
import { UpdatePasswordInput } from "../models/UserInput";
import { validate } from "class-validator";
import { AuthService } from "../services/auth.service";
import { plainToInstance } from "class-transformer";
import { LoginInput } from "../models/LoginInput";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loginInput = plainToInstance(LoginInput, req.body);
      const errors = await validate(loginInput);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      const user = await this.authService.login(loginInput);
      return res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  };
}
