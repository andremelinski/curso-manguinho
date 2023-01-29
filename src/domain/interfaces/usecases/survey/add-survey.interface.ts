import { ISurveyModel, ISurveyResultModel } from '../../model/survey-model-interface';

export type IAddSurveyDto = Omit<ISurveyModel, 'id'>
export interface IAddSurvey {
    add(data: IAddSurveyDto): Promise<void>
}

export type ISaveSurveyResultDto = Omit<ISurveyResultModel, 'id'>;
export interface ISaveSurveyResult {
	save(data: ISaveSurveyResultDto): Promise<ISurveyResultModel>;
}