import { Router } from "express";
import * as adminDashboardController from "../controllers/adminDashboardController.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = Router();

// Protected Admin Dashboard
router.get("/dashboard", authenticate, authorize("SUPER_ADMIN", "OPERATOR_DESA"), adminDashboardController.getDashboardSummary);
router.get("/audit-logs", authenticate, authorize("SUPER_ADMIN"), adminDashboardController.getAuditLogs);

export default router;
