import { UserService } from "../user.service";
import { UserFilter, UserRepository } from "../../repositories/user.repository";
import { hashPassword } from "../../utils/password.utils";
import { EnumRole } from "../../types/EnumRole";
import { UserInput } from "../../models/UserInput";
import { User } from "../../entities/user.entity";
// Mock dependencies
jest.mock("../../repositories/user.repository");
jest.mock("../../utils/password.utils");

describe("UserService", () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    userService = new UserService();
  });

  describe("createUser", () => {
    const createUserDto = {
      email: "test@example.com",
      password: "Password123!",
      firstName: "John",
      lastName: "Doe",
      phone: "+84123456789",
      role: EnumRole.Waiter,
    };

    it("should create user successfully", async () => {
      const hashedPassword = "hashedPassword123";
      (hashPassword as jest.Mock).mockResolvedValue(hashedPassword);

      const mockCreatedUser = {
        id: "1",
        ...createUserDto,
        password: hashedPassword,
        isActive: true,
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.findByPhone.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(mockCreatedUser as User);

      const result = await userService.createUser(createUserDto as UserInput);

      expect(result).toEqual(mockCreatedUser);
      expect(hashPassword).toHaveBeenCalledWith(createUserDto.password);
    });

    it("should throw error when email already exists", async () => {
      mockUserRepository.findByEmail.mockResolvedValue({ id: "1" } as User);

      await expect(
        userService.createUser(createUserDto as UserInput)
      ).rejects.toThrow("Email already exists");
    });

    it("should throw error when phone already exists", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.findByPhone.mockResolvedValue({ id: "1" } as User);

      await expect(
        userService.createUser(createUserDto as UserInput)
      ).rejects.toThrow("Phone number already exists");
    });
  });

  describe("updateUser", () => {
    const userId = "1";
    const updateUserDto = {
      firstName: "Updated",
      lastName: "Name",
      role: EnumRole.Cashier,
    };

    it("should update user successfully", async () => {
      const mockUser = {
        id: userId,
        ...updateUserDto,
        email: "test@example.com",
      };

      mockUserRepository.findById.mockResolvedValue(mockUser as User);
      mockUserRepository.update.mockResolvedValue(mockUser as User);

      const result = await userService.updateUser(
        userId,
        updateUserDto as UserInput
      );

      expect(result).toEqual(mockUser);
    });

    it("should throw error when user not found", async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(
        userService.updateUser(userId, updateUserDto)
      ).rejects.toThrow("User not found");
    });

    it("should hash password when updating password", async () => {
      const updateWithPassword = {
        ...updateUserDto,
        password: "NewPassword123!",
      };
      const hashedPassword = "newHashedPassword";

      mockUserRepository.findById.mockResolvedValue({ id: userId } as User);
      (hashPassword as jest.Mock).mockResolvedValue(hashedPassword);

      await userService.updateUser(userId, updateWithPassword);

      expect(hashPassword).toHaveBeenCalledWith(updateWithPassword.password);
    });
  });

  describe("filterUsers", () => {
    it("should return filtered users", async () => {
      const filterOptions = {
        search: "john",
        role: EnumRole.Waiter,
        isActive: true,
      };

      const mockUsers = [
        { id: "1", firstName: "John", role: EnumRole.Waiter } as User,
        { id: "2", firstName: "Johnny", role: EnumRole.Waiter } as User,
      ];

      mockUserRepository.filterUsers.mockResolvedValue({
        users: mockUsers,
        total: 2,
      });

      const result = await userService.getAllUsers(filterOptions as UserFilter);

      expect(result.users).toEqual(mockUsers);
      expect(result.total).toBe(2);
    });
  });
});
