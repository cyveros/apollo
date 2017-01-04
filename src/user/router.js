// /src/user/router.js
import { Router } from 'express';
import Controller from './controller';

const router = Router();

router.route('/users')
	.get(Controller.getUser)
	.post(Controller.createUser)
	.put(Controller.updateUser)
	.delete(Controller.deleteUser);

export default router;