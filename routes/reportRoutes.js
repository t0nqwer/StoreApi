import express from "express";
import { getCurrentSaleTotal } from "../controllers/Report.js";

const router = express.Router();

router.get("/sale-total", getCurrentSaleTotal);

export default router;
