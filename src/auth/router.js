// /src/auth/router.js
import { Router } from 'express';

import Controller from './controller';

const router = Router();

router.route('/auth')
	.get(Controller.getAuth)
	.post(Controller.postAuth);

export default router;