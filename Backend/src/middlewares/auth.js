import { AppError } from "../utils/AppError.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { prisma } from "../config/prisma.js";

export const authenticate = async (req, res, next) => {
  try {
    let token = req.cookies?.accessToken;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new AppError("Sesi Anda belum terautentikasi. Silakan masuk terlebih dahulu.", 401);
    }

    const decoded = verifyAccessToken(token);

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, username: true, nama: true, role: true, isActive: true },
    });

    if (!admin || !admin.isActive) {
      throw new AppError("Akun operator tidak valid atau telah dinonaktifkan.", 401);
    }

    req.user = admin;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new AppError("Sesi Anda telah kedaluwarsa. Silakan muat ulang atau masuk kembali.", 401));
    }
    if (err.name === "JsonWebTokenError") {
      return next(new AppError("Token autentikasi tidak valid.", 401));
    }
    next(err);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("Anda tidak memiliki hak akses untuk tindakan ini.", 403));
    }
    next();
  };
};
