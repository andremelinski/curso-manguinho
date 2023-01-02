import { IValidation } from '../../../presentation/interfaces';
import { badRequest, ok, serverError, unauthorized } from '../../helper/http-helper';
import { HttpReponse, HttpRequest, IAuthentication, IController } from './login-protocols';


export default class LoginController implements IController {
	private readonly authentication: IAuthentication;


	private readonly validation: IValidation;

	constructor(authentication: IAuthentication, validation: IValidation) {
		this.authentication = authentication;
		this.validation = validation;
	}

	// eslint-disable-next-line require-await
	async handle(httpRequest: HttpRequest): Promise<HttpReponse> {
		try {
			const accountInfo = httpRequest.body;
			const validationError = this.validation.validate(accountInfo);

			if (validationError) {
				return badRequest(validationError);
			}
			const authToken = await this.authentication.auth(
				accountInfo.email,
				accountInfo.password
			);

			if (!authToken) {
				return unauthorized();
			}

			return ok(authToken);
		} catch (error) {
			return serverError(error);
		}
	}
}
