import { Repository, UpdateResult, DeleteResult } from "typeorm";
import { AppDataSource } from "../config/database";
import { User } from "../entities/user.entity";
import { EnumRole } from "../types/EnumRole";

export type SortField =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "role"
  | "createdAt"
  | "updatedAt";
export type SortOrder = "ASC" | "DESC";

export interface UserFilter {
  search?: string;
  role?: EnumRole;
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
  sortField?: SortField;
  sortOrder?: SortOrder;
}

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.repository.create(userData);
    return await this.repository.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({ where: { email } });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return await this.repository.findOne({ where: { phone } });
  }

  async findAll(): Promise<User[]> {
    return await this.repository.find();
  }

  async findByRole(role: EnumRole): Promise<User[]> {
    return await this.repository.find({ where: { role } });
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const result: UpdateResult = await this.repository.update(id, userData);
    if (result.affected === 0) {
      return null;
    }
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? true : false;
  }

  async deleteMany(ids: string[]): Promise<boolean> {
    const result: DeleteResult = await this.repository.delete(ids);
    return result.affected ? true : false;
  }

  async updateStatus(id: string, isActive: boolean): Promise<User | null> {
    const result: UpdateResult = await this.repository.update(id, { isActive });
    if (result.affected === 0) {
      return null;
    }
    return await this.findById(id);
  }

  async findActiveUsers(): Promise<User[]> {
    return await this.repository.find({ where: { isActive: true } });
  }

  async filterUsers(
    filter: UserFilter
  ): Promise<{ users: User[]; total: number }> {
    const queryBuilder = this.repository.createQueryBuilder("user");

    // Search using fulltext index
    if (filter.search) {
      queryBuilder.andWhere(
        "MATCH(user.email, user.phone, user.firstName, user.lastName, user.address) AGAINST (:search IN BOOLEAN MODE)",
        { search: `*${filter.search}*` }
      );
    }

    // Filter by role
    if (filter.role) {
      queryBuilder.andWhere("user.role = :role", { role: filter.role });
    }

    // Filter by active status
    if (filter.isActive !== undefined) {
      queryBuilder.andWhere("user.isActive = :isActive", {
        isActive: filter.isActive,
      });
    }

    // Filter by date range
    if (filter.startDate && filter.endDate) {
      queryBuilder.andWhere("user.createdAt BETWEEN :startDate AND :endDate", {
        startDate: filter.startDate,
        endDate: filter.endDate,
      });
    }

    // Sorting
    if (filter.sortField) {
      const order: SortOrder = filter.sortOrder || "ASC";
      queryBuilder.orderBy(`user.${filter.sortField}`, order);
    } else {
      // Default sorting by createdAt DESC if no sort specified
      queryBuilder.orderBy("user.createdAt", "DESC");
    }

    // Pagination
    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    // Get total count
    const [users, total] = await queryBuilder.getManyAndCount();

    return {
      users,
      total,
    };
  }
}
