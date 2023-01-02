import { IValidation } from '../../../presentation/interfaces';
import { MissingParamError } from '../../errors';


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