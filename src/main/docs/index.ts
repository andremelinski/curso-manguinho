import { badRequest, forbidden, notFound, securitySchemes, serverError, unauthorized } from './components';
import { loginPath, surveyPath } from './paths';
import { accountSchema, errorSchema, loginParamsSchema, surveyAnswerSchema, surveySchema, surveysSchema } from './schemas';

export default {
	openapi: '3.0.0',
	info: {
		title: 'Clean Node API',
		description: 'API do cursso do manguinho',
		version: '1.0.0',
	},
	// license: {
	// 	name: '',
	// 	url: ''
	// },
	servers: [
		{
			url: '/api',
			description: 'default URL for any endpoint',
		},
	],
	tags: [{ name: 'Login' }, { name: 'Survey' }],
	paths: { '/login': loginPath, '/surveys': surveyPath },
	schemas: { account: accountSchema, loginParams: loginParamsSchema, error: errorSchema, survey: surveySchema, surveyAnswer: surveyAnswerSchema, surveys: surveysSchema },
	components: { securitySchemes, badRequest, unauthorized, serverError, notFound, forbidden },
};