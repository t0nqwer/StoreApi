import pkg from "mongoose";
const { Schema, model, models } = pkg;

const appSettingsSchema = new Schema({
  storeName: { type: "string" },
  cashDrawerPath: { type: "string" },
  printer: { type: "string" },
});

const AppSettings =
  models.AppSettings || model("AppSettings", appSettingsSchema);

export default AppSettings;
