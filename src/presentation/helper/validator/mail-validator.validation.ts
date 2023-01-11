import { InvalidParamError } from '../../errors';
import { IEmailValidator, IValidation } from '../../interfaces';


export class EmailValidation implements IValidation {
	emailValidator: IEmailValidator;

	constructor(emailValidator: IEmailValidator) {
		this.emailValidator = emailValidator;
	}

	// eslint-disable-next-line consistent-return, @typescript-eslint/no-explicit-any
	validate({ email }: any): Error | undefined {
		const isValid = this.emailValidator.isValid(email);

		if (!isValid) {
			return new InvalidParamError('email');
		}
	}
}