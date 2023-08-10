import express from "express";
import {
  StartApp,
  StoreList,
  checkStoreOpen,
  openShop,
  selectStore,
} from "../controllers/App.js";
const router = express.Router();

router.get("/StartApp", StartApp);
router.get("/checkStore", checkStoreOpen);
router.get("/StoreList", StoreList);
router.post("/SelectStore", selectStore);
router.post("/OpenStore", openShop);
export default router;
