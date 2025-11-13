import { z } from "zod"

export const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
  display_name: z.string().max(50, "Display name must be less than 50 characters").optional(),
  bio: z.string().max(200, "Bio must be less than 200 characters").optional(),
  avatar_url: z.string().url("Invalid URL").optional().or(z.literal("")),
})

export const linkSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  url: z.string().url("Invalid URL"),
  icon_url: z.string().optional(),
  is_active: z.boolean().optional(),
  scheduled_start: z.string().optional(),
  scheduled_end: z.string().optional(),
})

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(100, "Password must be less than 100 characters")

export const emailSchema = z.string().email("Invalid email address")

