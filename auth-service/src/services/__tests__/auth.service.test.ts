import { AuthService } from "../auth.service";
import { UserRepository } from "../../repositories/user.repository";
import { comparePassword } from "../../utils/password.utils";
import { LoginInput } from "../../models/LoginInput";
import { User } from "../../entities/user.entity";
import { EnumRole } from "../../types/EnumRole";
// Mock dependencies
jest.mock("../../repositories/user.repository");
jest.mock("../../utils/password.utils");

describe("AuthService", () => {
  let authService: AuthService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    authService = new AuthService();
  });

  describe("login", () => {
    const loginInput: LoginInput = {
      email: "test@example.com",
      password: "Password123!",
    };

    it("should successfully login with valid credentials", async () => {
      const mockUser: Partial<User> = {
        id: "1",
        email: "test@example.com",
        password: "hashedPassword",
        role: EnumRole.Waiter,
        isActive: true,
        phone: "+84123456789",
        firstName: "John",
        lastName: "Doe",
        address: "123 Main St",
        url_Image: "https://example.com/image.jpg",
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser as User);
      (comparePassword as jest.Mock).mockResolvedValue(true);

      const result = await authService.login(loginInput);

      expect(result).toHaveProperty("user");
      expect(result).toHaveProperty("token");
      expect(result.user.id).toBe(mockUser.id);
      expect(result.user.email).toBe(mockUser.email);
    });

    it("should throw error when user not found", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login(loginInput)).rejects.toThrow(
        "Invalid credentials"
      );
    });

    it("should throw error when user is inactive", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        password: "hashedPassword",
        isActive: false,
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser as User);

      await expect(authService.login(loginInput)).rejects.toThrow(
        "User is inactive"
      );
    });

    it("should throw error when password is incorrect", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        password: "hashedPassword",
        isActive: true,
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser as User);
      (comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(loginInput)).rejects.toThrow(
        "Invalid credentials"
      );
    });
  });
});
