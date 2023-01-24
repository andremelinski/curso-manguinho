import { ISurveyModel } from '../../model/survey-model-interface';

export interface ILoadSurveys {
	load(): Promise<ISurveyModel[]>;
}