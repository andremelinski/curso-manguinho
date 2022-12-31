import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, ok, serverError } from '../../helper/http-helper';
import { HttpReponse, HttpRequest, IAddAccount, IController, IEmailValidator } from './signup-protocols';

export class SignUpController implements IController {
	private readonly emailValidator: IEmailValidator;

	private readonly addAccount: IAddAccount;

	constructor(emailValidator: IEmailValidator, addAccountModel: IAddAccount) {
		this.emailValidator = emailValidator;
		this.addAccount = addAccountModel;
	}

	async handle(httpRequest: HttpRequest): Promise<HttpReponse> {
		try {
			const requiredFields = ['email', 'name', 'password', 'passwordConfirmation'];

			const { body } = httpRequest;

			for (const field of requiredFields) {
				if (!body[field]) {
					return badRequest(new MissingParamError(field));
				}
			}
			const { name, email, password, passwordConfirmation } = body;

			if (password !== passwordConfirmation) {
				return badRequest(new InvalidParamError('passwordConfirmation'));
			}
			const isValid = this.emailValidator.isValid(email);

			if (!isValid) {
				return badRequest(new InvalidParamError('email'));
			}

			const newAccount = await this.addAccount.add({
				name,
				email,
				password,
			});

			return ok(newAccount);
		} catch (error) {
			return serverError(error);
		}
	}
}
