// /src/user/router.js
import { Router } from 'express';
import validate from 'express-validation';
import JWTCheck from 'express-jwt';
import Controller from './controller';
import ValidationRule from './middlewares/validation';
import config from '../config';
import UserModel from './models/user.seq';
import modelLoader from '../support/middlewares/model-loader';

const router = Router();

router.route('/users')
	.all(JWTCheck({
		secret: config.jwtSecret
	}))
	.all(modelLoader('user.model.users', UserModel))
	.get(Controller.getUser)
	.post(validate(ValidationRule.create), Controller.createUser)
	.put(Controller.updateUser)
	.delete(Controller.deleteUser);

export default router;