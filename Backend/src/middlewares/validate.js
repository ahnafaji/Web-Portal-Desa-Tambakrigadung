import { AppError } from "../utils/AppError.js";

/**
 * Middleware validation generator using Zod.
 * Produces clean, citizen-friendly Indonesian error messages without technical prefixes,
 * while still attaching structured field errors in `errors` for frontend form binding.
 */
export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    // Replace with sanitized values (stripping unexpected mass-assignment fields)
    req.body = parsed.body || req.body;
    req.query = parsed.query || req.query;
    req.params = parsed.params || req.params;
    next();
  } catch (err) {
    if (err.errors && Array.isArray(err.errors)) {
      // 1. Structured errors for frontend forms (stripping top-level 'body.', 'query.', 'params.')
      const structuredErrors = err.errors.map((e) => {
        const pathSegments = e.path.filter((p) => p !== "body" && p !== "query" && p !== "params");
        const field = pathSegments.join(".") || "umum";
        return {
          field,
          message: e.message,
        };
      });

      // 2. Human-readable combined string for village residents
      // Remove trailing dots from individual messages before joining with commas
      const uniqueMessages = Array.from(
        new Set(err.errors.map((e) => e.message.trim().replace(/\.+$/, "")))
      );
      const citizenFriendlyMessage = `Mohon periksa kembali isian Anda: ${uniqueMessages.join(", ")}.`;

      return next(new AppError(citizenFriendlyMessage, 400, structuredErrors));
    }
    next(err);
  }
};
