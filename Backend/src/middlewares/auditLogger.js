import { prisma } from "../config/prisma.js";

export const logAudit = async ({ req, action, entity, entityId = null, details = null }) => {
  try {
    const adminId = req.user?.id || null;
    const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"] || null;

    await prisma.auditLog.create({
      data: {
        adminId,
        action,
        entity,
        entityId,
        details,
        ipAddress: typeof ipAddress === "string" ? ipAddress : JSON.stringify(ipAddress),
        userAgent,
      },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("⚠️ Audit log recording failed:", err.message);
  }
};
