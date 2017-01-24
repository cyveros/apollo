// /src/reception/router.js
import { Router } from 'express';

import Controller from './controller';

const router = Router();

router.route('/reception')
	.post(Controller.postReceived);

export default router;