import { Router } from "express";
import * as galeriController from "../controllers/galeriController.js";

const router = Router();

router.get("/halaman", galeriController.getGaleriPage);
router.get("/:slug", galeriController.getGaleriDetail);

export default router;
