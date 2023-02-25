import { loginPath } from './paths/login-path';
import { accountSchema } from './schemas/account-schema';
import { loginParamsSchema } from './schemas/login-params-schema';
import { unauthorizedSchema } from './schemas/unauthorized.schema';

export default {
	openapi: '3.0.0',
	info: {
		title: 'Clean Node API',
		description: 'API do cursso do manguinho',
		version: '1.0.0',
	},
	servers: [
		{
			url: '/api',
			description: 'default URL for any endpoint',
		},
	],
	tags: [{ name: 'Login' }],
	paths: { '/login': loginPath },
	schemas: { account: accountSchema, loginParams: loginParamsSchema, unauthorized: unauthorizedSchema },
};