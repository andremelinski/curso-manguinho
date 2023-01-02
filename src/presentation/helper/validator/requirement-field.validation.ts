import { MissingParamError } from '../../errors';
import { IValidation } from './validation.interface';

export class RequiredFieldValidation implements IValidation {
	private readonly requiredField;

	constructor(requiredField: string) {
		this.requiredField = requiredField;
	}

	// eslint-disable-next-line consistent-return
	validate(object: any): Error | undefined {
		if (!object[this.requiredField]) {
			return new MissingParamError(this.requiredField);
		}
	}
}