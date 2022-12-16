import { HttpReponse, HttpRequest } from '../http/http';

export class SignUpController {
	handle(httRequest: HttpRequest): HttpReponse {
		if (!httRequest.body.name) {
			return { statusCode: 400, body: new Error('Missing param: name') };
		}
		if (!httRequest.body.email) {
			return { statusCode: 400, body: new Error('Missing param: email') };
		}
	}
}
