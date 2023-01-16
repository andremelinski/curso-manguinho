import { AccessDeniedError } from '../../errors';
import { forbidden } from '../../helper/http-helper';
import { HttpReponse, HttpRequest, IMiddleware } from '../../http';

export class AuthMiddleware implements IMiddleware {
	handle(httpRequest: HttpRequest): Promise<HttpReponse> {
		// try {
		const forb = forbidden(new AccessDeniedError());

		return new Promise((resolve) => {
			return resolve(forb);
		});
		// } catch (error) {
		// 	return serverError(error);
		// }
	}
}