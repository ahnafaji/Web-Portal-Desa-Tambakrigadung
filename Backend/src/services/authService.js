import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { generateTokens, verifyRefreshToken } from "../utils/jwt.js";

export const loginAdmin = async ({ identifier, password }) => {
  const admin = await prisma.admin.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
  });

  if (!admin || !admin.isActive) {
    throw new AppError("Email/username atau kata sandi tidak valid.", 401);
  }

  const isMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!isMatch) {
    throw new AppError("Email/username atau kata sandi tidak valid.", 401);
  }

  // Update last login
  await prisma.admin.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  });

  const payload = { id: admin.id, email: admin.email, role: admin.role };
  const tokens = generateTokens(payload);

  return {
    admin: {
      id: admin.id,
      email: admin.email,
      username: admin.username,
      nama: admin.nama,
      role: admin.role,
    },
    ...tokens,
  };
};

export const refreshAdminToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError("Refresh token tidak ditemukan.", 401);
  }

  const decoded = verifyRefreshToken(refreshToken);

  const admin = await prisma.admin.findUnique({
    where: { id: decoded.id },
    select: { id: true, email: true, username: true, nama: true, role: true, isActive: true },
  });

  if (!admin || !admin.isActive) {
    throw new AppError("Akun operator tidak lagi aktif.", 401);
  }

  const payload = { id: admin.id, email: admin.email, role: admin.role };
  const tokens = generateTokens(payload);

  return { admin, ...tokens };
};
