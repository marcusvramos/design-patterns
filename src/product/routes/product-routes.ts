import { Router } from "express";
import { ProductController } from "../controller/product-controller";

const router = Router();
const productControl = new ProductController();

router.post("/", productControl.createProduct);
router.put("/stock", productControl.updateStock);
router.get("/", productControl.getProducts);
export default router;
