import { Router } from 'express';

import { adaptMiddleware } from '../adapters/express-middleware.adapter';
import { adaptRoute } from '../adapters/express-route.adapter';
import { makeAddSurveyController } from '../factories/controllers/add-survey';
import { makeLoadSurveysController } from '../factories/controllers/load-surveys';
import { makeAuthMiddleware } from '../factories/controllers/middleware/auth-midleware';


export default (router: Router): void => {
	const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'));
	const auth = adaptMiddleware(makeAuthMiddleware());

	router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()));
	router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()));
};