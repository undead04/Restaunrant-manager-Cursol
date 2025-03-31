export default class CustomError extends Error {
  statusCode: number;
  field?: string; // Trường lỗi cụ thể, nếu có

  constructor(statusCode: number, message: string, field?: string) {
    super(message);
    this.statusCode = statusCode;
    this.field = field; // Gán trường lỗi
    this.name = this.constructor.name;

    // Đảm bảo đúng prototype
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
