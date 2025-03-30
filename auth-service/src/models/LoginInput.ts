import { IsEmail, MinLength, IsString, IsNotEmpty } from "class-validator";

export class LoginInput {
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Email is invalid" })
  email!: string;

  @IsNotEmpty({ message: "Password is required" })
  @IsString({ message: "Password must be a string" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  password!: string;
}
