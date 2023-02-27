export const badRequest = {
	description: 'Invalid Requisition',
	content: { 'application/json': { schema: { $ref: '#/schemas/error' } } },
};

export const serverError = {
	description: 'Invalid Requisition',
	content: { 'application/json': { schema: { $ref: '#/schemas/error' } } },
};

export const unauthorized = {
	description: 'Invalid Requisition',
	content: { 'application/json': { schema: { $ref: '#/schemas/error' } } },
};

export const notFound = { description: 'Endpoint Not Found' };

export const forbidden = {
	description: 'Forbidden Access',
	content: { 'application/json': { schema: { $ref: '#/schemas/error' } } },
};