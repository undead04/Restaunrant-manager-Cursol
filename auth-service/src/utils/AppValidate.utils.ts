import { validate } from "class-validator";
import { ErrorResponse } from "./Response.utils";

const AppValidate = async (input: any) => {
  const errors = await validate(input);
  if (errors.length > 0) {
    return ErrorResponse(
      "Validation failed",
      errors.map((error) => error.constraints),
      400
    );
  }
  return null;
};

export default AppValidate;
