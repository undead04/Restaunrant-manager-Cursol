import { User } from "../entities/user.entity";
import { UserFilter, UserRepository } from "../repositories/user.repository";
import {
  UpdatePasswordInput,
  UpdateUserInput,
  UserInput,
} from "../models/UserInput";
import { comparePassword, hashPassword } from "../utils/password.utils";
import CustomError from "../models/CustomeError";

export class UserService {
  private userRepository = new UserRepository();

  async getAllUsers(
    filter: UserFilter
  ): Promise<{ users: User[]; total: number }> {
    return this.userRepository.filterUsers(filter);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }
  async createUser(user: UserInput): Promise<User | null> {
    await this.validateUniqueFields(user.email, user.phone);

    // Hash password
    const hashedPassword = await hashPassword(user.password);

    return this.userRepository.create({
      ...user,
      password: hashedPassword,
    });
  }
  async updatePassword(
    id: string,
    updateData: UpdatePasswordInput
  ): Promise<User | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;
    if (!(await comparePassword(updateData.currentPassword, user.password))) {
      throw new CustomError(400, "Current password and Password is incorrect");
    }
    if (updateData.newPassword === updateData.currentPassword) {
      throw new CustomError(
        400,
        "The new password and the current password cannot be the same."
      );
    }
    const hashedPassword = await hashPassword(updateData.newPassword);
    user.password = hashedPassword;
    return await this.userRepository.update(id, user);
  }
  async updateUser(
    id: string,
    updateData: UpdateUserInput
  ): Promise<User | null> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new CustomError(404, "User not found");
    }

    // Only validate unique fields if they are being updated
    if (updateData.email || updateData.phone) {
      await this.validateUniqueFields(
        updateData.email || existingUser.email,
        updateData.phone || existingUser.phone,
        id
      );
    }

    return this.userRepository.update(id, updateData);
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result;
  }

  async deleteUsers(ids: string[]) {
    try {
      if (!ids || ids.length === 0) {
        throw new CustomError(400, "No user IDs provided");
      }
      // Thực hiện xóa
      const result = await this.userRepository.deleteMany(ids);
      return result;
    } catch (error) {
      console.error("Error deleting users:", error);
      throw error;
    }
  }

  private async validateUniqueFields(
    email: string,
    phone: string,
    userId?: string
  ): Promise<void> {
    // Check unique email
    const existingEmail = await this.userRepository.findByEmail(email);
    if (existingEmail && existingEmail.id !== userId) {
      throw new CustomError(400, "Email already exists");
    }

    // Check unique phone
    const existingPhone = await this.userRepository.findByPhone(phone);
    if (existingPhone && existingPhone.id !== userId) {
      throw new CustomError(400, "Phone number already exists");
    }
  }

  async importUsers(users: UserInput[]): Promise<{
    success: User[];
    errors: { row: number; error: string }[];
  }> {
    const results = {
      success: [] as User[],
      errors: [] as { row: number; error: string }[],
    };

    for (let i = 0; i < users.length; i++) {
      try {
        const userData: UserInput = users[i];

        const newUser = await this.createUser(userData);
        if (newUser) {
          results.success.push(newUser);
        }
      } catch (error: any) {
        results.errors.push({
          row: i + 2, // +2 because Excel starts at 1 and has header row
          error: error.message,
        });
      }
    }
    return results;
  }
}
