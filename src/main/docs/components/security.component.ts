export const securitySchemes = {
	apiKeyAuth: {
		type: 'apiKey',
		in: 'header',
		name: 'x-access-token'
	}
};