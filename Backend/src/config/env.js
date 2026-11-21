import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().transform((val) => parseInt(val, 10)).default("5000"),
  FRONTEND_URL: z.string().default("http://localhost:5173"),

  DATABASE_URL: z.string({
    required_error: "DATABASE_URL is required in .env",
  }),
  DIRECT_URL: z.string().optional(),

  SUPABASE_URL: z.string({
    required_error: "SUPABASE_URL is required in .env",
  }),
  SUPABASE_SERVICE_ROLE_KEY: z.string({
    required_error: "SUPABASE_SERVICE_ROLE_KEY is required in .env",
  }),
  SUPABASE_STORAGE_BUCKET: z.string().default("portal-desa"),

  JWT_ACCESS_SECRET: z.string().min(16, "JWT_ACCESS_SECRET must be at least 16 chars"),
  JWT_REFRESH_SECRET: z.string().min(16, "JWT_REFRESH_SECRET must be at least 16 chars"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error("❌ Invalid environment variables:", JSON.stringify(parsed.error.format(), null, 2));
  throw new Error("Invalid backend environment configuration.");
}

export const env = parsed.data;
