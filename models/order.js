import pkg from "mongoose";
const { Schema, model, models } = pkg;
import Product from "./product.js";
import Customer from "./customer.js";

const productSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: Product, required: true },
  quantity: { type: Number, required: true },
});
const orderSchema = new Schema({
  employees: String,
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    default: "pending",
    required: true,
    enum: ["pending", "complete", "wait for payment", "cancelled"],
  },
  total: { type: Number, default: 0 },
  products: { type: [productSchema], required: true },
  customer: { type: Schema.Types.ObjectId, ref: Customer },
  payment: {
    type: String,
    enum: ["cash", "credit", "debit"],
    default: "credit",
  },
});
const Order = models.Order || model("Order", orderSchema);
export default Order;
