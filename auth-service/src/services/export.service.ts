import xlsx from "xlsx";
import { User } from "../entities/user.entity";
import { hashPassword } from "../utils/password.utils";

export class ExportService {
  async exportUsersToExcel(users: User[]): Promise<Buffer> {
    // Chuẩn bị data để export
    const data = users.map((user) => ({
      ID: user.id,
      Email: user.email,
      "First Name": user.firstName,
      "Last Name": user.lastName,
      Phone: user.phone,
      Role: user.role,
      Status: user.isActive ? "Active" : "Inactive",
      "Created At": user.createdAt.toISOString(),
      "Updated At": user.updatedAt.toISOString(),
      Address: user.address,
    }));

    // Tạo workbook và worksheet
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);

    // Thêm worksheet vào workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, "Users");

    // Convert to buffer
    return xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });
  }

  async parseExcelToUsers(buffer: Buffer): Promise<Partial<User>[]> {
    // Đọc file excel
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Validate và transform data
    return data.map((row: any) => ({
      email: row["Email"],
      firstName: row["First Name"],
      lastName: row["Last Name"],
      phone: row["Phone"],
      role: row["Role"],
      isActive: row["Status"] === "Active",
      address: row["Address"],
    }));
  }
}
