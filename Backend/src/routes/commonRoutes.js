import { Router } from "express";
import * as commonController from "../controllers/commonController.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { uploadImagesOnly } from "../middlewares/uploadValidator.js";

const router = Router();
// Rute publik & admin: slider, statistik, profil, perangkat desa, potensi, dan kontak
const adminGuard = [authenticate, authorize("SUPER_ADMIN", "OPERATOR_DESA")];

router.get("/slider", commonController.getSlider);

router.get("/statistik", commonController.getStatistik);
router.put("/statistik", ...adminGuard, commonController.updateStatistik);

router.get("/profil", commonController.getProfil);
router.put("/profil", ...adminGuard, commonController.updateProfil);

router.get("/perangkat", commonController.getPerangkat);
router.post("/perangkat", ...adminGuard, uploadImagesOnly.single("foto"), commonController.createPerangkat);
router.put("/perangkat/:id", ...adminGuard, uploadImagesOnly.single("foto"), commonController.updatePerangkat);
router.delete("/perangkat/:id", ...adminGuard, commonController.deletePerangkat);

router.get("/sambutan", commonController.getSambutan);

router.get("/potensi", commonController.getPotensi);
router.get("/potensi/halaman", commonController.getPotensiPage);
router.put("/potensi/angka", ...adminGuard, commonController.updatePotensiAngka);
router.post("/potensi", ...adminGuard, uploadImagesOnly.single("image"), commonController.createPotensi);
router.put("/potensi/:id", ...adminGuard, uploadImagesOnly.single("image"), commonController.updatePotensi);
router.delete("/potensi/:id", ...adminGuard, commonController.deletePotensi);

router.get("/kontak", commonController.getKontak);
router.get("/kontak/halaman", commonController.getKontakPage);

export default router;  