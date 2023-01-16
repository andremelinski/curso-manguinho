import AddSurveyController from '../../../presentation/controllers/survey/add-survey/add-survey.controller';
import { IController } from '../../../presentation/http';
import { makeLogControllerDecorator } from '../decorator/log-controller-decorator-factory';
import { makeDbAddSurvey } from '../usecases/survey/db-add-survey.factory';
import { makeAddSurveyValidation } from '../validators/survey/add-survey.validation';

export const makeAddSurveyController = (): IController => {
	const addSurveyController = new AddSurveyController(makeDbAddSurvey(), makeAddSurveyValidation());

	return makeLogControllerDecorator(addSurveyController);
};