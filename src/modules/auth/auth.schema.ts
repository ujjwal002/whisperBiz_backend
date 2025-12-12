// src/modules/auth/auth.schema.ts
import { z } from "zod";

export const registerBusinessSchema = z.object({
  businessName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginBusinessSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerUserSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  businessCode: z.string().startsWith("BIZ-"),
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
