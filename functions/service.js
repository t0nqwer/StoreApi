import axios from "axios";
import dotenv from "dotenv";
import Service from "../models/service.js";
import Product from "../models/product.js";
import mongoose from "mongoose";
dotenv.config();
const getStoreList = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.SERVER_URL}/store/storelist`
    );
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
        }
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
const getStores = () => {};
