import {
	ISaveSurveyResult,
	ISaveSurveyResultDto,
	ISaveSurveyResultRepository,
	ISurveyResultModel,
} from './db-save-survey-result-protocols';


export default class DbSaveSurveyResult implements ISaveSurveyResult {
	constructor(private readonly saveSurveyResultRepository: ISaveSurveyResultRepository) {}

	save(data: ISaveSurveyResultDto): Promise<ISurveyResultModel> {
		const survey = this.saveSurveyResultRepository.save(data);

		return survey;
	}
}