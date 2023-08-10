import pkg from "mongoose";
const { Schema, model, models } = pkg;
import Store from "./store.js";
import Product from "./product.js";

const productSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: Product, required: true },
  quantity: { type: Number, required: true },
});
const transferSchema = new Schema({
  from: { type: Schema.Types.ObjectId, ref: Store, required: true },
  to: { type: Schema.Types.ObjectId, ref: Store, required: true },
  transferDate: { type: Date, required: true },
  deliverDate: { type: Date },
  status: {
    type: String,
    required: true,
    enum: ["In Transit", "Delivered", "Cancelled"],
  },
  products: [productSchema],
});
const Transfer = models.Transfer || model("Transfer", transferSchema);

export default Transfer;
