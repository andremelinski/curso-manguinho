import { HttpReponse, HttpRequest } from '../http/http';

export class SignUpController {
	// eslint-disable-next-line class-methods-use-this
	handle(httRequest: HttpRequest): HttpReponse {
		if (!httRequest.body.name) {
			return { statusCode: 400, body: new Error('Missing param: name') };
		}
		if (!httRequest.body.email) {
			return { statusCode: 400, body: new Error('Missing param: email') };
		}
		return { statusCode: 200, body: 'ok!' };
	}
}
