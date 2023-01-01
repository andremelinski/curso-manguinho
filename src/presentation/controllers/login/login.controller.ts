import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, ok, serverError, unauthorized } from '../../helper/http-helper';
import { HttpReponse, HttpRequest, IAuthentication, IController, IEmailValidator } from './login-protocols';


export default class LoginController implements IController {
	private readonly authentication: IAuthentication;

	private readonly emailValidator: IEmailValidator;

	constructor(emailValidator: IEmailValidator, authentication: IAuthentication) {
		this.emailValidator = emailValidator;
		this.authentication = authentication;
	}

	// eslint-disable-next-line require-await
	async handle(httpRequest: HttpRequest): Promise<HttpReponse> {
		try {
			const requiredFields = ['email', 'password',];

			const accountInfo = httpRequest.body;

			for (const field of requiredFields) {
				if (!accountInfo[field]) {
					return badRequest(new MissingParamError(field));
				}
			}

			const isValid = this.emailValidator.isValid(accountInfo.email);

			if (!isValid) {
				return badRequest(new InvalidParamError('email'));
			}
			const authToken = await this.authentication.auth(accountInfo.email, accountInfo.password);

			if (!authToken) {
				return unauthorized();
			}

			return ok(authToken);
		} catch (error) {
			return serverError(error);
		}
	}
}
