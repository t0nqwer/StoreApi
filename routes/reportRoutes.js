import express from "express";
import { getCurrentSaleTotal, ClosePos } from "../controllers/Report.js";

const router = express.Router();

router.get("/sale-total", getCurrentSaleTotal);
router.post("/submit", ClosePos);

export default router;
