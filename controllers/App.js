import AppSettings from "../models/appsetting.js";
import Service from "../models/service.js";
import axios from "axios";
import Store from "../models/store.js";
import Pos from "../models/posstore.js";
import moment from "moment-timezone";
export const StartApp = async (req, res) => {
  try {
    const app = await AppSettings.findOne({});
    console.log(app);
    res.status(200).json(app);
  } catch (error) {
    res.status(500).json("application not found");
  }
};
export const StoreList = async (req, res) => {
  try {
    const app = await Service.findOne().select("StoreList");
    const notExpire = app.StoreList.filter(
      (store) => store.closeDate > Date.now() || store.closeDate === null
    );

    res.status(200).json(notExpire);
  } catch (error) {
    res.status(500).json("application not found");
  }
};
export const selectStore = async (req, res) => {
  const { name } = req.body;
  console.log(process.env.SERVER_URL);
  try {
    const { data } = await axios.post(
      `${process.env.SERVER_URL}/store/getstoreinfo`,
      {
        name: name,
      }
    );
    await Store.create(data);
    const app = await AppSettings.findOne();
    await AppSettings.updateOne({ _id: app._id }, { storeName: name });
    res.status(200).json(name);
  } catch (error) {
    console.log(error.message);
  }
};
export const checkStoreOpen = async (req, res) => {
  try {
    const IsOpen = await Pos.findOne({ status: "open" });
    if (IsOpen === null) throw Error("Store is not open");
    res.status(200).json(IsOpen);
  } catch (error) {
    res.status(400).json(error.message);
  }
};
export const openShop = async (req, res) => {
  const { cash } = req.body;
  try {
    const data = await Pos.create({
      status: "open",
      dateOpen: new Date(),
      cashdrawer: cash,
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error.message);
  }
};
// StartApp();
