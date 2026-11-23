import { Router } from "express";
import * as umkmController from "../controllers/umkmController.js";
import { uploadImagesOnly } from "../middlewares/uploadValidator.js";
import { publicUploadLimiter } from "../middlewares/rateLimiter.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { umkmPublicDaftarSchema } from "../validations/schemas.js";

const router = Router();

router.get("/", umkmController.getUmkmList);
router.get("/halaman", umkmController.getUmkmPage);
router.get("/:slug", umkmController.getUmkmDetail);

// Public Registration
router.post(
  "/daftar",
  publicUploadLimiter,
  uploadImagesOnly.array("foto", 3),
  validate(umkmPublicDaftarSchema),
  umkmController.submitDaftarUmkm
);

// Admin Management & Verification
router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "OPERATOR_DESA"),
  uploadImagesOnly.array("fotos", 5),
  umkmController.createUmkm
);
router.put(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "OPERATOR_DESA"),
  uploadImagesOnly.array("fotos", 5),
  umkmController.updateUmkm
);
router.patch("/:id/status", authenticate, authorize("SUPER_ADMIN", "OPERATOR_DESA"), umkmController.verifyUmkm);
router.patch("/:id/verify", authenticate, authorize("SUPER_ADMIN", "OPERATOR_DESA"), umkmController.verifyUmkm);
router.delete("/:id", authenticate, authorize("SUPER_ADMIN"), umkmController.deleteUmkm);

export default router;
