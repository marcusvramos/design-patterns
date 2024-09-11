import { Router } from 'express';
import { PurchaseController } from '../controller/purchase-controller';

const router = Router();
const purchaseControl = new PurchaseController();

router.post('/', purchaseControl.createPurchase);
router.get('/', purchaseControl.getPurchases);

export default router;
