import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import { authenticate } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema } from "../validations/schemas.js";

const router = Router();

router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authenticate, authController.logout);
router.get("/me", authenticate, authController.getMe);

export default router;
