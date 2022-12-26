import validator from 'validator';

import { IEmailValidator } from '../presentation/interfaces';

export default class EmailValidatorAdapter implements IEmailValidator {
	isValid(email: string): boolean {
		return validator.isEmail(email);
	}
}
