export interface SurveyAnswerDto {
    image?: string;
    answer: string;
}

export interface IAddSurveyDto {
	question: string;
	answers: SurveyAnswerDto[];
	date: Date;
}

export interface IAddSurvey {
    add(data: IAddSurveyDto): Promise<void>
}