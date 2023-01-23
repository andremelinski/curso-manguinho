import { badRequest, noContent, serverError } from '../../../helper/http-helper';
import { HttpReponse, HttpRequest, IAddSurvey, IAddSurveyDto, IController, IValidation } from './add-surver-protocols';

export default class AddSurveyController implements IController {
	constructor(private readonly addSurvey: IAddSurvey, private readonly validation: IValidation) {}

	async handle(httpRequest: HttpRequest): Promise<HttpReponse> {
		try {
			const error = this.validation.validate(httpRequest?.body);

			if (error) {
				return badRequest(error);
			}
			const { question, answers } = httpRequest.body;
			const addSurvey: IAddSurveyDto = { question, answers, date: new Date() };

			await this.addSurvey.add(addSurvey);

			return noContent();
		} catch (error) {
			return serverError(error);
		}
	}
}
