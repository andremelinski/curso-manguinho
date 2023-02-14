import { InvalidParamError } from '../../../errors';
import { forbidden, ok, serverError } from '../../../helper/http-helper';
import { IController } from '../../../http/controller.interface';
import {
	HttpReponse,
	HttpRequest,
	ILoadSurveyById,
	ISaveSurveyResult,
	ISaveSurveyResultDto,
} from './save-survey-result.protocols';

export class SaveSurveyResultController implements IController {
	constructor(
		private readonly surveyRepo: ILoadSurveyById,
		private readonly surveyResultRepo: ISaveSurveyResult
	) {}

	async handle(httpRequest: HttpRequest): Promise<HttpReponse> {
		try {
			// console.log({ httpRequest });
			const { surveyId } = httpRequest.params;
			const survey = await this.surveyRepo.loadById(surveyId);

			if (survey) {
				const { answer } = httpRequest.body;

				const answerExist = survey.answers.some(el => {
					return el.answer === answer;
				});

				if (!answerExist) {
					return forbidden(new InvalidParamError('answer'));
				}

				const { accountId } = httpRequest;
				const saveSurveyResultDto: ISaveSurveyResultDto = {
					surveyId: survey.id,
					accountId,
					answer,
					date: new Date(),
				};

				this.surveyResultRepo.save(saveSurveyResultDto);
				return ok('ok');
			}
			return forbidden(new InvalidParamError('survey_id'));
		} catch (error) {
			// console.error(error);
			return serverError(error);
		}
	}
}