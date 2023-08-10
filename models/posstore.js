import pkg from "mongoose";
const { Schema, model, models } = pkg;

const posSchema = new Schema({
  cashdrawer: { type: Number },
  dateOpen: { type: Date },
  dateClose: { type: Date },
  status: { type: String, enum: ["open", "closed"], required: true },
  cashin: { type: Number },
  cashout: { type: Number },
});

const Pos = models.Pos || model("Pos", posSchema);
export default Pos;
