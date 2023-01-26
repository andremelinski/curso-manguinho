import { ISurveyModel } from '../../model/survey-model-interface';

export type IAddSurveyDto = Omit<ISurveyModel, 'id'>


export interface IAddSurvey {
    add(data: IAddSurveyDto): Promise<void>
}