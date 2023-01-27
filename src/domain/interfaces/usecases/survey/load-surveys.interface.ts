import { ISurveyModel } from '../../model/survey-model-interface';

export interface ILoadSurveys {
	load(): Promise<ISurveyModel[]>;
}

export interface ILoadSurveyById {
	loadById(id: string): Promise<ISurveyModel>;
}