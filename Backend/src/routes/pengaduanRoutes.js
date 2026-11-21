import { Router } from "express";
import * as pengaduanController from "../controllers/pengaduanController.js";
import { uploadPengaduanAttachment } from "../middlewares/uploadValidator.js";
import { publicUploadLimiter } from "../middlewares/rateLimiter.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { pengaduanSchema } from "../validations/schemas.js";

const router = Router();

// Public Submission with strict rate limiter and attachment upload
router.post(
  "/",
  publicUploadLimiter,
  uploadPengaduanAttachment.single("bukti"),
  validate(pengaduanSchema),
  pengaduanController.submitPengaduan
);

router.get("/track/:tiket", pengaduanController.trackPengaduan);

// Admin Disposisi & Status Update
router.patch("/:id/status", authenticate, authorize("SUPER_ADMIN", "OPERATOR_DESA"), pengaduanController.updateStatusPengaduan);

export default router;
