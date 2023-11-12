import Product from "../models/product.js";
import { createBill } from "../functions/service.js";
import Bill from "../models/bill.js";
import Pos from "../models/posstore.js";

export const ListProduct = async (req, res) => {
  const { search } = req.query;
  try {
    console.log(search);
    const products = await Product.find({
      $or: [
        {
          barcode: {
            $regex: search,
            $options: "i",
          },
        },
        {
          code: {
            $regex: search,
            $options: "i",
          },
        },
        {
          fabric: {
            $regex: search,
            $options: "i",
          },
        },
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    });
    console.log(ListProduct, "list");
    res.json(products);
  } catch (error) {
    console.log(error.message);
    res.json(error.message);
  }
};
export const AddProduct = async (req, res) => {
  const { billName, barcode } = req.body;
  try {
    if (billName === "" || !billName) {
      const bill = await createBill();
      const product = await Product.findOne({ barcode });
      const inputProduct = {
        product: product._id,
        barcode: product.barcode,
        qty: 1,
      };
      const NewBill = await Bill.updateOne(
        {
          _id: bill._id,
        },
        {
          $push: {
            products: inputProduct,
          },
        }
      );
      if (NewBill) {
        const active = await Bill.findOne({ _id: bill._id }).populate(
          "products"
        );
        return res.json(active);
      }
    }
    const product = await Product.findOne({ barcode });
    const currentBill = await Bill.findOne({ name: billName }).sort({
      date: -1,
    });
    const inputProduct = {
      product: product._id,
      barcode: product.barcode,
      qty: 1,
    };
    const updatebill = await Bill.updateOne(
      { _id: currentBill._id },
      {
        $push: {
          products: inputProduct,
        },
      }
    );
    if (updatebill) {
      const active = await Bill.findOne({ _id: currentBill._id }).populate(
        "products"
      );
      res.json(active);
    }
  } catch (error) {
    console.log(error.message);
    res.json(error.message);
  }
};
export const AddQty = async (req, res) => {
  const { billName, barcode } = req.body;
  try {
    console.log(billName, barcode);
    const currentBill = await Bill.findOne({ name: billName }).sort({
      date: -1,
    });
    const prosuctsID = currentBill.products.find((e) => e.barcode === barcode);
    const updatebill = await Bill.updateOne(
      { _id: currentBill._id, "products._id": prosuctsID._id },
      {
        $inc: {
          "products.$.qty": 1,
        },
      }
    );
    if (updatebill) {
      const active = await Bill.findOne({ _id: currentBill._id }).populate(
        "products"
      );
      console.log(active.products);
      res.json(active);
    }
  } catch (error) {
    console.log(error.message);
    res.json(error.message);
  }
};
export const DecreseQty = async (req, res) => {
  const { billName, barcode, pull } = req.body;
  try {
    const currentBill = await Bill.findOne({ name: billName }).sort({
      date: -1,
    });
    const prosuctsID = currentBill.products.find((e) => e.barcode === barcode);
    if (pull) {
      console.log(pull);
      const updatebill = await Bill.updateOne(
        { _id: currentBill._id },
        {
          $pull: {
            products: {
              _id: prosuctsID._id,
            },
          },
        }
      );
      if (updatebill) {
        const active = await Bill.findOne({ _id: currentBill._id }).populate(
          "products"
        );
        res.json(active);
      }
    } else {
      const updatebill = await Bill.updateOne(
        { _id: currentBill._id, "products._id": prosuctsID._id },
        {
          $inc: {
            "products.$.qty": -1,
          },
        }
      );
      if (updatebill) {
        const active = await Bill.findOne({ _id: currentBill._id }).populate(
          "products"
        );
        res.json(active);
      }
    }
  } catch (error) {
    console.log(error.message);
    res.json(error.message);
  }
};
export const DeleteProduct = async (req, res) => {
  const { billName, barcode } = req.body;
  try {
    const currentBill = await Bill.findOne({ name: billName }).sort({
      date: -1,
    });
    const prosuctsID = currentBill.products.find((e) => e.barcode === barcode);
    const updatebill = await Bill.updateOne(
      { _id: currentBill._id },
      {
        $pull: {
          products: {
            _id: prosuctsID._id,
          },
        },
      }
    );
    if (updatebill) {
      const active = await Bill.findOne({ _id: currentBill._id }).populate(
        "products"
      );

      res.json(active);
    }
  } catch (error) {
    console.log(error.message);
    res.json(error.message);
  }
};
export const GetBillList = async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const findBill = await Bill.find({
      date: { $gte: startOfToday },
      active: "active",
    })
      .sort({ date: -1 })
      .populate("products");
    res.json(findBill);
  } catch (error) {
    console.log(error.message);
    res.json(error.message);
  }
};
export const DeleteBill = async (req, res) => {
  const { id } = req.params;
  try {
    const setdelete = await Bill.updateOne({ _id: id }, { active: "delete" });
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    if (setdelete) {
      const newlist = await Bill.find({
        date: { $gte: startOfToday },
        active: "active",
      }).sort({ date: -1 });
      return res.json(newlist);
    }
  } catch (error) {
    console.log(error.message);
    res.json(error.message);
  }
};
export const CreateBill = async (req, res) => {
  try {
    const newbill = await createBill();
    res.json(newbill);
  } catch (error) {
    console.log(error.message);
    res.json(error.message);
  }
};
export const GetCurrentProductList = async (req, res) => {
  const { id } = req.params;
  try {
    const currentBill = await Bill.findOne({ _id: id }).select(
      "_id customProducts products"
    );
    console.log(currentBill);
    const barcodeArr = currentBill.products.map((product) => product.barcode);
    const products = await Product.find({
      barcode: {
        $in: barcodeArr,
      },
    });
    const resdata = products.map((product) => {
      const qty = currentBill.products.find(
        (e) => e.barcode === product.barcode
      );
      return {
        ...product._doc,
        qty: qty.qty,
      };
    });

    res.json(resdata.concat(currentBill.customProducts));
  } catch (error) {
    console.log(error.message);
    res.json(error.message);
  }
};
export const SetDiscount = async (req, res) => {
  const { billName, type, amount } = req.body;
  try {
    const currentBill = await Bill.findOne({ name: billName }).sort({
      date: -1,
    });
    const updatebill = await Bill.updateOne(
      { _id: currentBill._id },
      { distype: type, amount: +amount }
    );
    if (updatebill) {
      const active = await Bill.findOne({ _id: currentBill._id }).populate(
        "products"
      );

      res.json(active);
    }
  } catch (error) {
    console.log(error.message);
    res.json(error.message);
  }
};
export const SetBill = async (req, res) => {
  const { billID, payment, cash, total, disamout, change } = req.body;
  try {
    console.log(billID, payment, cash);
    const SetBill = await Bill.findOneAndUpdate(
      {
        _id: billID,
      },
      {
        payment,
        active: "purchase",
        cash: cash,
        total,
        disamout,
        change,
      }
    );

    if (SetBill) {
      console.log(SetBill);
      const now = new Date();
      const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const findBill = await Bill.find({
        date: { $gte: startOfToday },
        active: "active",
      })
        .sort({ date: -1 })
        .populate("products");
      res.json(findBill);
    }
  } catch (error) {
    console.log(error.message);
    res.json(error.message);
  }
};
export const AddCustomProduct = async (req, res) => {
  const { billID, name, price, qty } = req.body;
  try {
    if (billID === "" || !billID) {
      const bill = await createBill();
      const CustomProduct = {
        name: name,
        price: price,
      };
      const NewBill = await Bill.updateOne(
        {
          _id: bill._id,
        },

        { $push: { customProducts: CustomProduct } }
      );
      if (NewBill) {
        const active = await Bill.findOne({ _id: bill._id });
        return res.json(active);
      }
    }
    const CustomProduct = {
      name: name,
      price: price,
    };
    const updatebill = await Bill.updateOne(
      { _id: billID },
      { $push: { customProducts: CustomProduct } }
    );
    if (updatebill) {
      const active = await Bill.findOne({ _id: billID });
      res.json(active);
    }
  } catch (error) {
    console.log(error.message);
    res.json(error.message);
  }
};
export const RemoveCustomProduct = async (req, res) => {
  const { billID, DocID } = req.body;
  console.log(billID, DocID);
  try {
    const updatebill = await Bill.updateOne(
      { _id: billID },
      { $pull: { customProducts: { _id: DocID } } }
    );
    if (updatebill) {
      const active = await Bill.findOne({ _id: billID });
      res.json(active);
    }
  } catch (error) {
    console.log(error.message);
    res.json(error.message);
  }
};
