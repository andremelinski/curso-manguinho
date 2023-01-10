import { IAuthentication } from '../../../domain/interfaces/usecases/authentication.interface';
import { EmailInUseError } from '../../errors';
import { badRequest, forbidden, ok, serverError } from '../../helper/http-helper';
import { HttpReponse, HttpRequest, IAddAccount, IController, IValidation } from './signup-protocols';

export class SignUpController implements IController {
	private readonly addAccount: IAddAccount;

	private readonly validation: IValidation;

	private readonly authentication: IAuthentication;

	constructor(
		addAccountModel: IAddAccount,
		validation: IValidation,
		authentication: IAuthentication
	) {
		this.addAccount = addAccountModel;
		this.validation = validation;
		this.authentication = authentication;
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

			if (!newAccount) {
				return forbidden(new EmailInUseError(email));
			}

			const accessToken = await this.authentication.auth({ email, password });

			return ok(accessToken);
		} catch (error) {
			return serverError(error);
		}
	}
}
