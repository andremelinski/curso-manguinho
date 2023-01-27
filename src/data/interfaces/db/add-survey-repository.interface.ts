import { IAddSurveyDto } from '../../usecases/survey/add-survey/db-add-survey-protocols';

export interface IAddSurveyRepository {
	add(surveyData: IAddSurveyDto): Promise<void>;
}