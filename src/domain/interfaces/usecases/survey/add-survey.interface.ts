import { ISurveyModel, ISurveyResultModel } from '../../model/survey-model-interface';

export type IAddSurveyDto = Omit<ISurveyModel, 'id'>
export interface IAddSurvey {
    add(data: IAddSurveyDto): Promise<void>
}

export type IAddSurveyResultDto = Omit<ISurveyResultModel, 'id'>;
export interface ISaveSurveyModel {
	save(data: IAddSurveyResultDto): Promise<ISurveyResultModel>;
}