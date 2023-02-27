export const surveysSchema = {
	type: 'array',
	properties: { items: { $ref: '#/schemas/survey' } },
};