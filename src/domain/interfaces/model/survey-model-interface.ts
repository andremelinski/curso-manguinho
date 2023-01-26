export interface SurveyAnswerDto {
	image?: string;
	answer: string;
}

export interface ISurveyModel {
	id: string;
	question: string;
	answers: SurveyAnswerDto[];
	date: Date;
}

export interface ISurveyResultModel {
	id: string;
	surveyId: string;
	accountId: string;
	answer: string;
	date: Date;
}