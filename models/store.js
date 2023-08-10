import Product from "./product.js";
import pkg from "mongoose";
const { Schema, model, models } = pkg;

const StockSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: Product, required: true },
  quantity: { type: Number, required: true },
});
const eventSchema = new Schema({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
});

const StoreSchema = new Schema({
  _id: { type: String },
  name: { type: String, required: true },
  address: String,
  description: String,
  connectionID: String,
  status: { type: Boolean, required: true, default: false },
  event: eventSchema,
  stock: [StockSchema],
});

const Store = models.Store || model("Store", StoreSchema);
export default Store;
