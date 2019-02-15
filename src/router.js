// /src/router.js

import { Router } from 'express';

import HealthProvider from './health/provider';
import ReceptionProvider from './reception/provider';

function RouterProvider(app) {
	let router = Router();

	router.use(HealthProvider.application(app).provide());
	router.use(ReceptionProvider.application(app).provide());

	return router;
}

export default RouterProvider;
