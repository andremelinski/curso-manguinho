import { SurveyAnswerDto } from '../../model/survey-model-interface';


export interface IAddSurveyDto {
	question: string;
	answers: SurveyAnswerDto[];
	date: Date;
}

export interface IAddSurvey {
    add(data: IAddSurveyDto): Promise<void>
}