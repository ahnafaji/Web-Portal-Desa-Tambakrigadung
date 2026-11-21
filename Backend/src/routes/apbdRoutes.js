import { Router } from "express";
import * as apbdController from "../controllers/apbdController.js";

const router = Router();

router.get("/", apbdController.getApbdSummary);
router.get("/halaman", apbdController.getApbdPage);

export default router;
