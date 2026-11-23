import { Router } from "express";
import * as galeriController from "../controllers/galeriController.js";
import { uploadImagesOnly } from "../middlewares/uploadValidator.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = Router();

router.get("/", galeriController.getGaleriList);
router.get("/halaman", galeriController.getGaleriPage);
router.get("/:slug", galeriController.getGaleriDetail);

// Protected Admin Mutation Routes (supporting multiple photo uploads)
router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "OPERATOR_DESA"),
  uploadImagesOnly.array("fotos", 10),
  galeriController.createGaleri
);
router.put(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "OPERATOR_DESA"),
  uploadImagesOnly.array("fotos", 10),
  galeriController.updateGaleri
);
router.delete("/:id", authenticate, authorize("SUPER_ADMIN"), galeriController.deleteGaleri);

export default router;
