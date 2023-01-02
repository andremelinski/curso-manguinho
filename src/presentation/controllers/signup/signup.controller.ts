import { badRequest, ok, serverError } from '../../helper/http-helper';
import { HttpReponse, HttpRequest, IAddAccount, IController, IValidation } from './signup-protocols';

export class SignUpController implements IController {
	private readonly addAccount: IAddAccount;

	private readonly validation: IValidation;

	constructor(
		addAccountModel: IAddAccount,
		validation: IValidation,
	) {
		this.addAccount = addAccountModel;
		this.validation = validation;
	}

	async handle(httpRequest: HttpRequest): Promise<HttpReponse> {
		try {
			const { body } = httpRequest;

			const validationError = this.validation.validate(body);

			if (validationError) {
				return badRequest(validationError);
			}

			const { name, email, password } = body;

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
