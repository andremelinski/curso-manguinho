import { ServerError } from '../errors';
import { HttpReponse } from '../http/http';

export const badRequest = (error: Error): HttpReponse => {
	return {
		statusCode: 400,
		body: error,
	};
};

export const serverError = (): HttpReponse => {
	return {
		statusCode: 500,
		body: new ServerError(),
	};
};

export const ok = (data: any): HttpReponse => {
	return {
		statusCode: 200,
		body: data,
	};
};
