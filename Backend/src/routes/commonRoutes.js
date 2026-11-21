import { Router } from "express";
import * as commonController from "../controllers/commonController.js";

const router = Router();

router.get("/slider", commonController.getSlider);
router.get("/statistik", commonController.getStatistik);
router.get("/profil", commonController.getProfil);
router.get("/sambutan", commonController.getSambutan);
router.get("/potensi", commonController.getPotensi);
router.get("/potensi/halaman", commonController.getPotensiPage);
router.get("/kontak", commonController.getKontak);
router.get("/kontak/halaman", commonController.getKontakPage);

export default router;
