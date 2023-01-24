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
