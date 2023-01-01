import { InvalidParamError } from '../../errors';
import { badRequest, ok, serverError } from '../../helper/http-helper';
import { HttpReponse, HttpRequest, IAddAccount, IController, IEmailValidator, IValidation } from './signup-protocols';

export class SignUpController implements IController {
	private readonly emailValidator: IEmailValidator;

	private readonly addAccount: IAddAccount;

	private readonly validation: IValidation;

	constructor(
		emailValidator: IEmailValidator,
		addAccountModel: IAddAccount,
		validation: IValidation
	) {
		this.emailValidator = emailValidator;
		this.addAccount = addAccountModel;
		this.validation = validation;
	}

	async handle(httpRequest: HttpRequest): Promise<HttpReponse> {
		try {
			const { body } = httpRequest;

			const errorValidation = this.validation.validate(body);

			if (errorValidation) {
				return badRequest(errorValidation);
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
