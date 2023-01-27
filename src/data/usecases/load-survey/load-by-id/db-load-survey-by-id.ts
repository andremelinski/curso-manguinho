import { ILoadSurveyById, ISurveyModel } from './db-load-survey-by-id.protocols';

export default class DbLoadSurveyById implements ILoadSurveyById {
	constructor(private readonly loadSurveyRepository: ILoadSurveyById) {}

	async loadById(id: string): Promise<ISurveyModel> {
		const survey = await this.loadSurveyRepository.loadById(id);

		return survey;
	}
}
