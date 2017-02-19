// /src/router.js

import { Router } from 'express';
import AuthRouter from './auth/router';
import UserRouter from './user/router';
import HealthProvider from './health/provider';
import ReceptionProvider from './reception/provider';

function RouterProvider(app) {
	let router = Router();

	router.use(AuthRouter);
	router.use(UserRouter);
	router.use(HealthProvider.application(app).provide());
	router.use(ReceptionProvider.application(app).provide());

	return router;
}

export default RouterProvider;
