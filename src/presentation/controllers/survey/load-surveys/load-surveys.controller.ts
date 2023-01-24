import { noContent, ok, serverError } from '../../../helper/http-helper';
import { HttpReponse, HttpRequest, IController, ILoadSurveys } from './load-surveys-protocols';

export default class LoadSurveysController implements IController {
	constructor(private readonly loadSurveys: ILoadSurveys) {}

	async handle(httpRequest: HttpRequest): Promise<HttpReponse> {
		try {
			const surveys = await this.loadSurveys.load();

			return surveys.length ? ok(surveys) : noContent();
		} catch (error) {
			return serverError(error);
		}
	}
}
