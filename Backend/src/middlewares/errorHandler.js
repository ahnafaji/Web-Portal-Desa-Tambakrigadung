import { env } from "../config/env.js";

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (env.NODE_ENV === "development") {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || null,
      stack: err.stack,
      error: err,
    });
  }

  // Production: Do not leak stack traces or raw database internals
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || null,
    });
  }

  // Prisma / Unhandled generic errors in production
  // eslint-disable-next-line no-console
  console.error("💥 UNHANDLED ERROR:", err);
  return res.status(500).json({
    success: false,
    message: "Terjadi kesalahan internal pada server desa.",
  });
};
