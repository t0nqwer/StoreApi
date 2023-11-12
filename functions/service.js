import axios from "axios";
import dotenv from "dotenv";
import Service from "../models/service.js";
import Product from "../models/product.js";
import mongoose from "mongoose";
import Bill from "../models/bill.js";
import moment from "moment-timezone";
dotenv.config();
const getStoreList = async () => {
  try {
    const { data } = await axios.get(`${process.env.SERVER_URL}/store`);
    const getDoc = await Service.findOne();
    await Service.updateOne(
      {
        _id: getDoc._id,
      },
      {
        StoreList: data,
      }
    );
  } catch (error) {
    console.log(error.message);
  }
};
getStoreList();
const updateProduct = async () => {
  try {
    const { data } = await axios.get(`${process.env.SERVER_URL}/barcode`);
    const currentProduct = await Product.find().select("_id");
    const fetchProduct = data.map((product) => product._id);
    const inserdata = data.map((product) => ({
      _id: product._id,
      barcode: product.barcode,
      cloth: product.cloth,
      size: product.size,
      code: product.code,
      name: product.name,
      fabric: product.fabric,
      sort: product.sort,
      price: product.price,
      brand: product.brand,
    }));
    inserdata.map(async (product) => {
      await Product.findOneAndUpdate(
        { _id: product._id },
        {
          barcode: product.barcode,
          cloth: product.cloth,
          size: product.size,
          code: product.code,
          name: product.name,
          fabric: product.fabric,
          sort: product.sort,
          price: product.price,
          brand: product.brand,
        },
        { upsert: true }
      );
    });
    const difference = currentProduct
      .filter((product) => !fetchProduct.includes(product._id))
      .map((product) => product._id);
    await Product.deleteMany({
      _id: { $in: difference },
    });
  } catch (error) {
    console.log(error.message);
  }
};
updateProduct();

const useCountOrder = (lastorder) => {
  const alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  if (lastorder === "") {
    return "A1";
  }
  const first = lastorder.split("")[0];
  const second = lastorder.split("")[1];
  if (second < 9) {
    return `${first.toUpperCase()}${+second + 1}`;
  }
  if (second == 9) {
    let nextchar = alphabet
      .map((e, i) => {
        if (first === e) return i + 1;
      })
      .filter((e) => typeof e == "number");
    return `${alphabet[nextchar]}0`;
  }
  return;
};
export const createBill = async () => {
  try {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const findLastBill = await Bill.findOne({
      date: { $gte: startOfToday },
    }).sort({ date: -1 });

    if (!findLastBill) {
      const billname = useCountOrder("");
      const newBill = new Bill({
        name: billname,
        date: now,
      });
      await newBill.save();
      return newBill;
    }
    const billname = useCountOrder(findLastBill.name);
    const newBill = new Bill({
      name: billname,
      date: now,
    });
    await newBill.save();
    return newBill;
  } catch (error) {
    console.log(error.message);
  }
};
