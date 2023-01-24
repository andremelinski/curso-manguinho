import LoadSurveysController from '../../../presentation/controllers/survey/load-surveys/load-surveys.controller';
import { IController } from '../../../presentation/http';
import { makeLogControllerDecorator } from '../decorator/log-controller-decorator-factory';
import { makeDbLoadSurveys } from '../usecases/survey/db-load-surveys.factory';

export const makeLoadSurveysController = (): IController => {
	const addSurveyController = new LoadSurveysController(makeDbLoadSurveys());

	return makeLogControllerDecorator(addSurveyController);
};