import { z } from "zod";

export const RegisterSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(3, "Password must be at least 3 characters"),
});

export type Register = z.infer<typeof RegisterSchema>;
