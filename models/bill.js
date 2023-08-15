import pkg from "mongoose";
const { Schema, model, models } = pkg;
import Product from "./product.js";

const productSchema = new Schema({
  product: { type: Schema.Types.String, ref: Product, required: true },
  barcode: { type: String, required: true },
  qty: { type: Number, required: true },
});
const customProductSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, default: 1 },
});
const billSchema = new Schema({
  name: { type: String, required: true },
  date: { type: Date },
  products: [productSchema],
  customProducts: [customProductSchema],
  payment: {
    type: String,
    enum: ["cash", "credit", "transfer"],
  },
  total: { type: Number, default: 0 },
  cash: { type: Number, default: 0 },
  change: { type: Number, default: 0 },
  active: {
    type: String,
    enum: ["active", "purchase", "delete"],
    default: "active",
  },
  disamout: { type: Number },
  distype: {
    type: String,
    enum: ["percent", "int"],
  },
  amount: { type: Number },
});

const Bill = models.Bill || model("Bill", billSchema);

export default Bill;
