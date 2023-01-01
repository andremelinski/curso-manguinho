import { MissingParamError } from '../../../errors/missing-params.error';
import { IValidation } from './validation.interface';

export class RequiredFieldValidation implements IValidation {
	private readonly fieldName;

	constructor(fieldName: string) {
		this.fieldName = fieldName;
	}

	// eslint-disable-next-line consistent-return
	validate(object: any): Error | null {
		if (!object[ this.fieldName ]) {
			return new MissingParamError(this.fieldName);
		}
	}
}