import { Router } from 'express';
import { ProductController } from '../controller/product-controller';

const router = Router();
const productControl = new ProductController();

router.post('/', productControl.createProduct);
router.get('/', productControl.getProducts);

export default router;
