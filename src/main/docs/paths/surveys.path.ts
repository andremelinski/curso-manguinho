export const surveyPath = {
	get: {
		security: [{ apiKeyAuth: [] as string[] }],
		tags: ['Survey'],
		summary: 'API to list all surveys',
		responses: {
			200: {
				description: 'Success',
				content: { 'application/json': { schema: { $ref: '#/schemas/surveys' } } },
			},
			403: { $ref: '#/components/forbidden' },
			404: { $ref: '#/components/notFound' },
			500: { $ref: '#/components/serverError' },
		},
	},
	// post: {
	// 	tags: ['Survey'],
	// 	summary: 'API to create a survey',
	// 	requestBody: { content: { 'application/json': { schema: { $ref: '#/schemas/survey' } } } },
	// 	responses: {
	// 		200: {
	// 			description: 'Success',
	// 			content: { 'application/json': { schema: { $ref: '#/schemas/account' } } },
	// 		},
	// 		400: { $ref: '#/components/badRequest' },
	// 		401: { $ref: '#/components/unauthorized' },
	// 		404: { $ref: '#/components/notFound' },
	// 		500: { $ref: '#/components/serverError' },
	// 	},
	// },
};
