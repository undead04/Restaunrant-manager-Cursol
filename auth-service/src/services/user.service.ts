import { User } from "../entities/user.entity";
import { UserFilter, UserRepository } from "../repositories/user.repository";
import { UpdatePasswordInput, UserInput } from "../models/UserInput";
import { comparePassword, hashPassword } from "../utils/password.utils";

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
    return this.userRepository.create(user);
  }
  async updatePassword(
    id: string,
    updateData: UpdatePasswordInput
  ): Promise<User | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;
    if (await comparePassword(updateData.currentPassword, user.password)) {
      throw new Error("Current password and Password is incorrect");
    }
    const hashedPassword = await hashPassword(updateData.newPassword);
    return await this.userRepository.update(id, { password: hashedPassword });
  }
  async updateUser(
    id: string,
    updateData: Partial<User>
  ): Promise<User | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;

    return await this.userRepository.update(id, updateData);
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result;
  }
}
