import Bill from "../models/bill.js";
import Product from "../models/product.js";

export const getCurrentSaleTotal = async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const findBill = await Bill.find({
      date: { $gte: startOfToday },
      active: "purchase",
    })
      .sort({ date: -1 })
      .populate("products");

    const calcualteProduct = findBill.map(async (bill) => {
      const currentBill = await Bill.findOne({ _id: bill._id }).select(
        "_id customProducts products"
      );
      const barcodeArr = currentBill.products.map((product) => product.barcode);
      const products = await Product.find({
        barcode: {
          $in: barcodeArr,
        },
      }).select("_id price barcode");
      const resdata = products.map((product) => {
        const qty = currentBill.products.find(
          (e) => e.barcode === product.barcode
        );
        return product._doc.price * qty.qty;
      });
      return resdata;
    });
    const result = await Promise.all(calcualteProduct);
    const customProductsToTal = findBill
      .map((bill) => bill.customProducts)
      .flat()
      .map((e) => e.qty * e.price)
      .reduce((a, b) => a + b, 0);
    const total = result
      .map((e) => e.reduce((a, b) => a + b, 0))
      .reduce((a, b) => a + b, 0);

    res.status(200).json(total + customProductsToTal);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
};
