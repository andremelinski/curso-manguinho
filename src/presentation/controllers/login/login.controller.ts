import { IValidation } from '../../../presentation/interfaces';
import { badRequest, ok, serverError, unauthorized } from '../../helper/http-helper';
import { HttpReponse, HttpRequest, IAuthentication, IController } from './login-protocols';


export default class LoginController implements IController {
	constructor(
		private readonly authentication: IAuthentication,
		private readonly validation: IValidation
	) {}

	// eslint-disable-next-line require-await
	async handle(httpRequest: HttpRequest): Promise<HttpReponse> {
		try {
			const accountInfo = httpRequest.body;
			const validationError = this.validation.validate(accountInfo);

			if (validationError) {
				return badRequest(validationError);
			}
			const toAuth = {
				email: accountInfo.email,
				password: accountInfo.password,
			};
			const authToken = await this.authentication.auth(toAuth);

			if (!authToken) {
				return unauthorized();
			}

			return ok(authToken);
		} catch (error) {
			return serverError(error);
		}
	}
}
