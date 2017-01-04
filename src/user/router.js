// /src/user/router.js
import { Router } from 'express';
import JWTCheck from 'express-jwt';
import Controller from './controller';

const router = Router();

router.route('/users')
	.all(JWTCheck({
		secret: '123456789'
	}))
	.get(Controller.getUser)
	.post(Controller.createUser)
	.put(Controller.updateUser)
	.delete(Controller.deleteUser);

export default router;