import { z } from "zod";

export const RegisterSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(3, "Password must be at least 3 characters"),
});

export const LoginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(3, "Password must be at least 3 characters"),
});

export const updateSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .optional(),
  email: z.string().email().toLowerCase().trim().optional(),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(3, "Password must be at least 3 characters"),
  newPassword: z.string().min(3, "Password must be at least 3 characters"),
});

export const CreateLinkSchema = z.object({
  Url: z.string().trim().url("Invalid URL"),
});

export type Register = z.infer<typeof RegisterSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type update = z.infer<typeof updateSchema>;
export type updatePassword = z.infer<typeof updatePasswordSchema>;
export type CreateLink = z.infer<typeof CreateLinkSchema>;
