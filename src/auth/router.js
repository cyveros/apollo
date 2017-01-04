// /src/auth/router.js
import { Router } from 'express';
import validate from 'express-validation';

import Controller from './controller';
import ValidationRule from './middlewares/validation';

const router = Router();

router.route('/auth')
	.get(Controller.getAuth)
	.post(validate(ValidationRule.auth), Controller.postAuth);

export default router;