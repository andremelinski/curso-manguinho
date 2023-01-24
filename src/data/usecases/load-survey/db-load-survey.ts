import { ILoadSurveyRepository, ILoadSurveys, ISurveyModel } from './db-load-survey-protocols';

export default class DbLoadSurvey implements ILoadSurveys {
	constructor(private readonly loadAccountRepository: ILoadSurveyRepository) {}

	async load(): Promise<ISurveyModel[]> {
		const surveys = await this.loadAccountRepository.loadAll();

		return surveys;
	}
}
