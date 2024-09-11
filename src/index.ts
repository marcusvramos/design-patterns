import express from "express";
import { Application, Request, Response } from "express";
import userRouter from "./user/routes/user-routes";
import productRouter from "./product/routes/product-routes";
import purchaseRouter from "./purchase/routes/purchase-routes";

const app: Application = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/purchases", purchaseRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("OK!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
