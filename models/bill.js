import pkg from "mongoose";
const { Schema, model, models } = pkg;
import Product from "./product.js";

const productSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: Product, required: true },
  quantity: { type: Number, required: true },
});
const billSchema = new Schema({
  name: { type: String, required: true },
  date: { type: Date },
  products: [productSchema],
  payment: {
    type: String,
    enum: ["cash", "credit", "transfer"],
    default: "credit",
  },
  total: { type: Number, default: 0 },
  cash: { type: String },
});

const Bill = models.Bill || model("Bill", billSchema);

export default Bill;
