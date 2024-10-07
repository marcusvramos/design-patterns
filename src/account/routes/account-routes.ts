import { Router } from 'express';
import { AccountReceivableController } from '../controller/account-receivable-controller';
import { AccountToPayController } from '../controller/account-to-pay-controller';

const router = Router();
const accountReceivable = new AccountReceivableController();
const accountToPay = new AccountToPayController();

router.post('/pagar', (req, res) => accountToPay.settleAccount(req, res));
router.post('/receber', (req, res) => accountReceivable.settleAccount(req, res));



export default router;
