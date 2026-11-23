import { Router } from "express";
import * as beritaController from "../controllers/beritaController.js";
import { uploadImagesOnly } from "../middlewares/uploadValidator.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = Router();

router.get("/", beritaController.getBeritaList);
router.get("/halaman", beritaController.getBeritaPage);
router.get("/:slug", beritaController.getBeritaDetail);

// Protected Admin Mutation Routes (supporting multipart image upload)
router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "OPERATOR_DESA"),
  uploadImagesOnly.single("gambar"),
  beritaController.createBerita
);
router.put(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "OPERATOR_DESA"),
  uploadImagesOnly.single("gambar"),
  beritaController.updateBerita
);
router.delete("/:id", authenticate, authorize("SUPER_ADMIN"), beritaController.deleteBerita);

export default router;
