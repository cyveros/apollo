// /src/auth/router.js
import { Router } from 'express';
import validate from 'express-validation';

import Controller from './controller';
import ValidationRule from './middlewares/validation';
import UserModel from '../user/models/user.seq';
import modelLoader from '../support/middlewares/model-loader';

const router = Router();

router.route('/auth')
	.get(Controller.getAuth)
	.post(validate(ValidationRule.auth), modelLoader('user.model.users', UserModel), Controller.postAuth);

export default router;