import { IAddSurveyDto } from '../../usecases/add-survey/db-add-survey-protocols';

export interface IAddSurveyRepository {
	add(surveyData: IAddSurveyDto): Promise<void>;
}