// /src/user/router.js
import { Router } from 'express';
import validate from 'express-validation';
import JWTCheck from 'express-jwt';
import Controller from './controller';
import ValidationRule from './middlewares/validation';
import config from '../config';

const router = Router();

router.route('/users')
	.all(JWTCheck({
		secret: config.jwtSecret
	}))
	.get(Controller.getUser)
	.post(validate(ValidationRule.create), Controller.createUser)
	.put(Controller.updateUser)
	.delete(Controller.deleteUser);

export default router;