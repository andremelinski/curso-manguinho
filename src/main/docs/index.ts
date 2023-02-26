import { badRequest, notFound, serverError, unauthorized } from './components';
import { loginPath } from './paths';
import { accountSchema, errorSchema, loginParamsSchema } from './schemas';

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
	tags: [{ name: 'Login' }],
	paths: { '/login': loginPath },
	schemas: { account: accountSchema, loginParams: loginParamsSchema, error: errorSchema },
	components: { badRequest, unauthorized, serverError, notFound },
};