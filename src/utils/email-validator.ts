import validator from 'validator';

import { IEmailValidator } from '../presentation/interfaces';

export default class EmailValidatorAdapter implements IEmailValidator {
	// constructor() {}

	isValid(email: string): boolean {
		return validator.isEmail(email);
	}
}
