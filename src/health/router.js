// /src/health/router.js
import { Router } from 'express';

import Controller from './controller';

const router = Router();

router.route('/')
	.get(Controller.getHealth);

export default router;