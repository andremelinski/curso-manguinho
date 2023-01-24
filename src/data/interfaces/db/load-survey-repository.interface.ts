import { ISurveyModel } from '../../../domain/interfaces/model/survey-model-interface';

export interface ILoadSurveyRepository {
	loadAll(): Promise<ISurveyModel[]>;
}