import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { env } from "./config/env.js";
import { globalLimiter } from "./middlewares/rateLimiter.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import beritaRoutes from "./routes/beritaRoutes.js";
import umkmRoutes from "./routes/umkmRoutes.js";
import pengaduanRoutes from "./routes/pengaduanRoutes.js";
import galeriRoutes from "./routes/galeriRoutes.js";
import apbdRoutes from "./routes/apbdRoutes.js";
import commonRoutes from "./routes/commonRoutes.js";

const app = express();

// 1. Mandatory adjustment for reverse proxies on free cloud hosting (Render, Koyeb, Vercel, Railway)
app.set("trust proxy", 1);

// 2. HTTP Security Headers
app.use(helmet());

// 3. Strict CORS Configuration (Only allow configured frontend origin with credentials)
const allowedOrigins = [env.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server) or allowed whitelist
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Akses ditolak oleh kebijakan keamanan CORS."));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

// 4. Rate Limiting
app.use(globalLimiter);

// 5. Request Parsers (Restricting JSON payload size to 10kb to mitigate DoS)
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// 6. Logging
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// 7. Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "Web Portal Desa Tambakrigadung Backend",
    timestamp: new Date().toISOString(),
  });
});

// 8. API v1 Modular Routes
const v1Router = express.Router();
v1Router.use("/auth", authRoutes);
v1Router.use("/berita", beritaRoutes);
v1Router.use("/umkm", umkmRoutes);
v1Router.use("/pengaduan", pengaduanRoutes);
v1Router.use("/galeri", galeriRoutes);
v1Router.use("/apbd", apbdRoutes);
v1Router.use("/", commonRoutes);

app.use("/api/v1", v1Router);
// Fallback alias for backward-compatibility with /api
app.use("/api", v1Router);

// 9. 404 Route Handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Rute API [${req.method}] ${req.originalUrl} tidak ditemukan.`,
  });
});

// 10. Global Error Handler
app.use(errorHandler);

export default app;
