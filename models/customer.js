import pkg from "mongoose";
const { Schema, model, models } = pkg;

const customerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
});

const Customer = models.Customer || model("Customer", customerSchema);
export default Customer;
