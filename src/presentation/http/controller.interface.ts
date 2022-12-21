import { HttpReponse, HttpRequest } from '../http/http';

export interface IController {
	handle(httpRequest: HttpRequest): Promise<HttpReponse>;
}
