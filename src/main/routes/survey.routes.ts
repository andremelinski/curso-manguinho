import { Router } from 'express';

import { adaptRoute } from '../adapters/express-route.adapter';
import { makeAddSurveyController } from '../factories/controllers/add-survey';
import { makeLoadSurveysController } from '../factories/controllers/load-surveys';
import { makeSurveyResultController } from '../factories/controllers/survey-result';
import { adminAuth, auth } from '../middlewares/auth-middleware';

export default (router: Router): void => {
	router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()));
	router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()));
	router.put('/surveys/:surveyId/results', auth, adaptRoute(makeSurveyResultController()));
};