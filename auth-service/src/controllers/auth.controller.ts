import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { plainToInstance } from "class-transformer";
import { LoginInput } from "../models/LoginInput";
import AppValidate from "../utils/AppValidate.utils";
import { SuccessResponse } from "../utils/Response.utils";
export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginInput = plainToInstance(LoginInput, req.body);
      const result = await AppValidate(loginInput);
      if (result) {
        return res.status(400).json(result);
      }
      const user = await this.authService.login(loginInput);
      return res
        .status(200)
        .json(SuccessResponse("Login successful", user, 200));
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}
