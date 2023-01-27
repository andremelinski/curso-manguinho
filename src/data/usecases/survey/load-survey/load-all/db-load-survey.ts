import { ILoadSurveyRepository, ILoadSurveys, ISurveyModel } from './db-load-survey-protocols';

export default class DbLoadSurvey implements ILoadSurveys {
	constructor(private readonly loadSurveyRepository: ILoadSurveyRepository) {}

	async load(): Promise<ISurveyModel[]> {
		const surveys = await this.loadSurveyRepository.loadAll();

		return surveys;
	}
}
