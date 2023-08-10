import pkg from "mongoose";
const { Schema, model, models } = pkg;

const ProductSchema = new Schema({
  _id: { type: String },
  barcode: { type: String, required: true, unique: true },
  cloth: { type: Boolean, required: true },
  size: String,
  code: String,
  name: { type: String, required: true },
  fabric: String,
  sort: Number,
  price: { type: Number, required: true },
  brand: { type: String, required: true },
});
const Product = models.Product || model("Product", ProductSchema);
export default Product;
