// /src/router.js

import { Router } from 'express';
import AuthRouter from './auth/router';
import UserRouter from './user/router';
import HealthRouter from './health/router';

const router = Router();

router.use(AuthRouter);
router.use(UserRouter);
router.use(HealthRouter);
router.use(ReceptionRouter);

export default router;
