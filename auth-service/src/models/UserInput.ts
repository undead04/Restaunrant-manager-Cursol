import {
  IsString,
  MinLength,
  IsEmail,
  IsPhoneNumber,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Matches,
} from "class-validator";
import { EnumRole } from "../types/EnumRole";
import { MatchPassword } from "../validators/match-password.validator";

export class UserInput {
  @IsEmail({}, { message: "Email is invalid" })
  @IsNotEmpty({ message: "Email is required" })
  email!: string;

  @IsPhoneNumber("VN", { message: "Phone is invalid" })
  @IsNotEmpty({ message: "Phone is required" })
  phone!: string;

  @IsString({ message: "Password is invalid" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
    }
  )
  password!: string;

  @IsString({ message: "Address is invalid" })
  @IsNotEmpty({ message: "Address is required" })
  address!: string;

  @IsString({ message: "First name is invalid" })
  @IsNotEmpty({ message: "First name is required" })
  firstName!: string;

  @IsString({ message: "Last name is invalid" })
  @IsNotEmpty({ message: "Last name is required" })
  lastName!: string;

  @IsString({ message: "Url image is invalid" })
  @IsOptional({ message: "Url image is optional" })
  url_Image!: string;

  @IsEnum(EnumRole, { message: "Role is invalid" })
  @IsNotEmpty({ message: "Role is required" })
  role!: EnumRole;
}

export class UpdatePasswordInput {
  @IsString({ message: "Current password is invalid" })
  @IsNotEmpty({ message: "Current password is required" })
  currentPassword!: string;

  @IsString({ message: "New password is invalid" })
  @MinLength(8, { message: "New password must be at least 8 characters long" })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        "New password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
    }
  )
  @IsNotEmpty({ message: "New password is required" })
  newPassword!: string;

  @IsString({ message: "Confirm password is invalid" })
  @IsNotEmpty({ message: "Confirm password is required" })
  @MatchPassword("newPassword", {
    message: "Confirm password must match new password",
  })
  confirmPassword!: string;
}
