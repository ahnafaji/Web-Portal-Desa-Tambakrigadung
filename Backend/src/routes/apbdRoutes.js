import { Router } from "express";
import * as apbdController from "../controllers/apbdController.js";
import { uploadPengaduanAttachment } from "../middlewares/uploadValidator.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = Router();

// Public / Summary
router.get("/", apbdController.getApbd);
router.get("/halaman", apbdController.getApbdPage);

// Admin Management
router.post("/", authenticate, authorize("SUPER_ADMIN", "OPERATOR_DESA"), apbdController.createApbdItem);
router.put("/:id", authenticate, authorize("SUPER_ADMIN", "OPERATOR_DESA"), apbdController.updateApbdItem);
router.delete("/:id", authenticate, authorize("SUPER_ADMIN"), apbdController.deleteApbdItem);

// Upload PDF Salinan APBDes (using PDF mime validator)
router.post(
  "/:tahun/dokumen",
  authenticate,
  authorize("SUPER_ADMIN", "OPERATOR_DESA"),
  uploadPengaduanAttachment.single("dokumen"),
  apbdController.uploadApbdDokumen
);

export default router;
