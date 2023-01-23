import { HttpRequest } from '../../presentation/http';

export const correctSurveyHttpRequest: HttpRequest = {
	body: {
		question: 'any_question',
		answers: [{ image: 'any_image', answer: 'any_answer' }],
	},
};
