import { z } from "zod";
import { commonValidations } from "./validation";

export const registrationSchema = z.object({
  email: commonValidations.email,
  password: commonValidations.password,
});

export const loginSchema = z.object({
  email: commonValidations.email,
  password: z.string().min(1, "Password is required"),
});

const schema = z.object({
  name: z.string().min(3),
  email: z.string().email()
});

export default schema;