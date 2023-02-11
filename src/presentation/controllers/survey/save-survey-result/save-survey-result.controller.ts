import { InvalidParamError } from '../../../errors';
import { forbidden, ok } from '../../../helper/http-helper';
import { IController } from '../../../http/controller.interface';
import { HttpReponse, HttpRequest, ILoadSurveyById, ISaveSurveyResult } from './save-survey-result.protocols';

export default class SaveSurveyResultController implements IController {
	constructor(
		private readonly surveyRepo: ILoadSurveyById,
		private readonly surveyResultRepo: ISaveSurveyResult
	) {}

	async handle(httpRequest: HttpRequest): Promise<HttpReponse> {
		const { surveyId } = httpRequest.params;
		const survey = await this.surveyRepo.loadById(surveyId);

		if (survey) {
			// this.surveyResultRepo.save();
			return ok('ok');
		}
		return forbidden(new InvalidParamError('survey_id'));
	}
}