import { SaveSurveyResultController, } from '../../../presentation/controllers/survey/save-survey-result/save-survey-result.controller';
import { IController } from '../../../presentation/http';
import { makeLogControllerDecorator } from '../decorator/log-controller-decorator-factory';
import { makeSaveSurveyResult } from '../usecases/survey-result/db-save-survey-result.factory';
import { makeDbLoadSurveyById } from '../usecases/survey/db-load-survey-by-id.factory';


export const makeSurveyResultController = (): IController => {
	const saveSurveyResultController = new SaveSurveyResultController(
		makeDbLoadSurveyById(),
		makeSaveSurveyResult()
	);

	return makeLogControllerDecorator(saveSurveyResultController);
};
