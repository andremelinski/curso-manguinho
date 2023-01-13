import { IAddSurvey, IAddSurveyDto, IAddSurveyRepository } from './db-add-survey-protocols';

export default class DbAddSurvey implements IAddSurvey {
	constructor(private readonly addAccountRepository: IAddSurveyRepository) {}

	async add(surveyData: IAddSurveyDto): Promise<void> {
		await this.addAccountRepository.add(surveyData);
	}
}
