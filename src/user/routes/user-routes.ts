import { Router } from 'express';
import { UserController } from '../controller/user-controller';

const router = Router();
const userControl = new UserController();

router.post('/', userControl.createUser);
router.get('/', userControl.getUsers);

export default router;
