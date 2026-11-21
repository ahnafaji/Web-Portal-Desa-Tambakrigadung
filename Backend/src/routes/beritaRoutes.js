import { Router } from "express";
import * as beritaController from "../controllers/beritaController.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { beritaCreateSchema } from "../validations/schemas.js";

const router = Router();

router.get("/", beritaController.getBeritaList);
router.get("/halaman", beritaController.getBeritaPage);
router.get("/:slug", beritaController.getBeritaDetail);

// Protected Admin Mutation Routes
router.post("/", authenticate, authorize("SUPER_ADMIN", "OPERATOR_DESA"), validate(beritaCreateSchema), beritaController.createBerita);
router.put("/:id", authenticate, authorize("SUPER_ADMIN", "OPERATOR_DESA"), beritaController.updateBerita);
router.delete("/:id", authenticate, authorize("SUPER_ADMIN"), beritaController.deleteBerita);

export default router;
