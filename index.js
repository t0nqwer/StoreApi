import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectToDatabase } from "./functions/database.js";
import appRoutes from "./routes/appRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import ReportRoutes from "./routes/reportRoutes.js";
import "./functions/service.js";
const app = express();
app.use(express.json());
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
dotenv.config();
const port = process.env.PORT || 9900;
connectToDatabase();

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/app", appRoutes);
app.use("/product", productRoutes);
app.use("/report", ReportRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
