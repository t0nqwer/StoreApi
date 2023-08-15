import Bill from "../models/bill.js";
import Pos from "../models/posstore.js";
import Product from "../models/product.js";
import moment from "moment-timezone";

export const getCurrentSaleTotal = async (req, res) => {
  try {
    const findPos = await Pos.findOne({ status: "open" });
    const findBill = await Bill.find({
      date: { $gte: findPos.dateOpen },
      active: "purchase",
    });

    const total = findBill.map((bill) => bill.total).reduce((a, b) => a + b, 0);
    res.status(200).json(total);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
};

export const ClosePos = async (req, res) => {
  const { cash } = req.body;
  try {
    const findPos = await Pos.findOne({ status: "open" });
    const findBill = await Bill.find({
      date: { $gte: findPos.dateOpen },
      active: "purchase",
    });

    const calcualteChange = findBill
      .filter((bill) => bill.payment === "cash")
      .map((e) => e.cash - e.change)
      .reduce((a, b) => a + b, 0);
    const transferPay = findBill
      .filter((bill) => bill.payment === "transfer")
      .map((e) => e.total)
      .reduce((a, b) => a + b, 0);
    const creditPay = findBill
      .filter((bill) => bill.payment === "credit")
      .map((e) => e.total)
      .reduce((a, b) => a + b, 0);

    const total = findBill.map((bill) => bill.total).reduce((a, b) => a + b, 0);
    const discount = findBill
      .map((bill) => bill.disamout)
      .reduce((a, b) => a + b, 0);
    const productCount = findBill
      .map((bill) => bill.products)
      .flat()
      .map((product) => product.qty)
      .reduce((a, b) => a + b, 0);
    const Barcodecount = [
      ...new Set(
        findBill
          .map((bill) => bill.products)
          .flat()
          .map((product) => product.barcode)
      ),
    ];
    const codeCount = await Product.find({
      barcode: { $in: Barcodecount },
    }).select("code");
    const codeCountArr = [...new Set(codeCount.map((e) => e.code))];

    const date = moment
      .tz(new Date(), "Asia/Bangkok")
      .format("YYYY-MM-DD HH:mm:ss");
    const resdata = {
      start: findPos.cashdrawer,
      change: findPos.cashdrawer + calcualteChange,
      drawer: +cash,
      diffrence: +cash - (findPos.cashdrawer + calcualteChange),
      cashPay: calcualteChange,
      transferPay: transferPay,
      creditPay: creditPay,
      totalPay: total,
      discount: discount,
      productCount: productCount,
      Barcodecount: Barcodecount.length,
      codeCount: codeCountArr.length,
      date: date,
    };
    await Pos.updateOne(
      { _id: findPos._id },
      {
        status: "closed",
      }
    );

    res.json(resdata);
  } catch (error) {
    console.log(error);
  }
};
