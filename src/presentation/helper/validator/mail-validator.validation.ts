import { InvalidParamError } from '../../errors';
import { IEmailValidator } from '../../interfaces';
import { IValidation } from './validation.interface';

export default class EmailValidation implements IValidation {
	emailValidator: IEmailValidator;

	constructor(emailValidator: IEmailValidator) {
		this.emailValidator = emailValidator;
	}

	// eslint-disable-next-line consistent-return
	validate({ email }: any): Error | undefined {
		const isValid = this.emailValidator.isValid(email);

		if (!isValid) {
			return new InvalidParamError('email');
		}
	}
}