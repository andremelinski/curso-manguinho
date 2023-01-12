export interface SurveyAnswerDto {
	image: string;
	answers: string;
}

export interface IAddSurveyDto {
    question: string,
    answers: SurveyAnswerDto[]
}

export interface IAddSurvey {
    add(data: IAddSurveyDto): Promise<void>
}