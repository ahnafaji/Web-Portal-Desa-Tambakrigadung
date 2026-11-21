import * as authService from "../services/authService.js";
import { setAuthCookies, clearAuthCookies } from "../utils/jwt.js";
import { sendResponse } from "../utils/response.js";
import { logAudit } from "../middlewares/auditLogger.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginAdmin({
      identifier: email,
      password,
    });

    setAuthCookies(res, result.accessToken, result.refreshToken);

    await logAudit({
      req: { ...req, user: result.admin },
      action: "LOGIN",
      entity: "AUTH",
      entityId: result.admin.id,
      details: { email: result.admin.email },
    });

    return sendResponse(res, 200, "Login operator berhasil.", {
      user: result.admin,
      token: result.accessToken,
    });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    const result = await authService.refreshAdminToken(refreshToken);

    setAuthCookies(res, result.accessToken, result.refreshToken);

    return sendResponse(res, 200, "Token berhasil diperbarui.", {
      user: result.admin,
      token: result.accessToken,
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    if (req.user) {
      await logAudit({
        req,
        action: "LOGOUT",
        entity: "AUTH",
        entityId: req.user.id,
      });
    }

    clearAuthCookies(res);
    return sendResponse(res, 200, "Berhasil keluar dari sistem operator.");
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    return sendResponse(res, 200, "Informasi akun operator aktif.", {
      user: req.user,
    });
  } catch (err) {
    next(err);
  }
};
