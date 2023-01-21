import { Router } from 'express';

import { adaptMiddleware } from '../adapters/express-middleware.adapter';
import { adaptRoute } from '../adapters/express-route.adapter';
import { makeAddSurveyController } from '../factories/controllers/add-survey';
import { makeAuthMiddleware } from '../factories/controllers/middleware/auth-midleware';


export default (router: Router): void => {
	const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'));

	router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()));
};