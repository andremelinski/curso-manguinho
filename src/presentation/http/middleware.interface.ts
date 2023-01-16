import { HttpReponse, HttpRequest } from './http';

export interface IMiddleware {
	handle(httpRequest: HttpRequest): Promise<HttpReponse>;
}
