// /src/router.js

import { Router } from 'express';
import AuthRouter from './auth/router';
import UserRouter from './user/router';
import HealthProvider from './health/provider';
import ReceptionRouter from './reception/router';

const router = Router();

router.use(AuthRouter);
router.use(UserRouter);
router.use(HealthProvider.provide());
router.use(ReceptionRouter);

export default router;
