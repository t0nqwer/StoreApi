import express from "express";
import {
  AddProduct,
  ListProduct,
  AddQty,
  DecreseQty,
  GetBillList,
  DeleteBill,
  CreateBill,
  DeleteProduct,
  GetCurrentProductList,
  SetDiscount,
  SetBill,
  AddCustomProduct,
} from "../controllers/Product.js";
const router = express.Router();

router.get("/ListProduct", ListProduct);
router.post("/AddProduct", AddProduct);
router.post("/AddQty", AddQty);
router.post("/DecreseQty", DecreseQty);
router.get("/GetBillList", GetBillList);
router.delete("/DeleteBill/:id", DeleteBill);
router.get("/CreateBill", CreateBill);
router.get("/GetCurrentProductList/:id", GetCurrentProductList);
router.post("/SetDiscount", SetDiscount);
router.post("/SetBill", SetBill);
router.post("/AddCustomProduct", AddCustomProduct);

router.put("/UpdateProduct");
router.post("/DeleteProduct", DeleteProduct);
export default router;
