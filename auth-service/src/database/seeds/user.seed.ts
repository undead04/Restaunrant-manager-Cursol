import { AppDataSource } from "../../config/database";
import { User } from "../../entities/user.entity";
import { EnumRole } from "../../types/EnumRole";
import { hashPassword } from "../../utils/password.utils";

export const seedUsers = async () => {
  const userRepository = AppDataSource.getRepository(User);

  // Kiểm tra nếu đã có data
  const existingUsers = await userRepository.count();
  if (existingUsers > 0) {
    console.log("Users already seeded");
    return;
  }

  // Tạo mật khẩu mặc định đã hash
  const defaultPassword = await hashPassword("Password123!");

  // Danh sách users để seed
  const users = [
    {
      email: "admin@restaurant.com",
      phone: "+84123456789",
      password: defaultPassword,
      firstName: "Admin",
      lastName: "User",
      address: "Ho Chi Minh City",
      role: EnumRole.Admin,
      isActive: true,
      url_Image: "https://example.com/admin.jpg",
    },
    {
      email: "cashier@restaurant.com",
      phone: "+84123456790",
      password: defaultPassword,
      firstName: "Cashier",
      lastName: "User",
      address: "Ho Chi Minh City",
      role: EnumRole.Cashier,
      isActive: true,
      url_Image: "https://example.com/cashier.jpg",
    },
    {
      email: "kitchen@restaurant.com",
      phone: "+84123456791",
      password: defaultPassword,
      firstName: "Kitchen",
      lastName: "User",
      address: "Ho Chi Minh City",
      role: EnumRole.Kitchen,
      isActive: true,
      url_Image: "https://example.com/kitchen.jpg",
    },
    {
      email: "waiter1@restaurant.com",
      phone: "+84123456792",
      password: defaultPassword,
      firstName: "Waiter",
      lastName: "One",
      address: "Ho Chi Minh City",
      role: EnumRole.Waiter,
      isActive: true,
      url_Image: "https://example.com/waiter1.jpg",
    },
    {
      email: "waiter2@restaurant.com",
      phone: "+84123456793",
      password: defaultPassword,
      firstName: "Waiter",
      lastName: "Two",
      address: "Ho Chi Minh City",
      role: EnumRole.Waiter,
      isActive: true,
      url_Image: "https://example.com/waiter2.jpg",
    },
  ];

  try {
    // Insert tất cả users
    await userRepository.save(users);
    console.log("Users seeded successfully");
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};
const runSeeds = async () => {
  try {
    // Chạy các seeds
    await seedUsers();
    console.log("All seeds completed");
  } catch (error) {
    console.error("Error running seeds:", error);
  }
};
export default runSeeds;
