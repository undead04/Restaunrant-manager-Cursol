import jwt from "jsonwebtoken";
import { User } from "../entities/user.entity";
import { comparePassword } from "../utils/password.utils";
import { UserRepository } from "../repositories/user.repository";
import { LoginInput } from "../models/LoginInput";
import CustomError from "../models/CustomeError";
export class AuthService {
  private userRepository = new UserRepository();

  async login({
    email,
    password,
  }: LoginInput): Promise<{ token: string; user: Partial<User> }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new CustomError(401, "Invalid credentials");
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new CustomError(401, "Invalid credentials");
    }

    const token = this.generateToken(user);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword,
    };
  }

  private generateToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" } // Set a fixed expiration time instead of using env variable
    );
  }
}
