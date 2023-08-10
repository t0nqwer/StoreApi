import pkg from "mongoose";
const { Schema, model, models } = pkg;

const serviceSchema = new Schema({
  StoreList: Array,
});
const Service = models.Service || model("Service", serviceSchema);

export default Service;
