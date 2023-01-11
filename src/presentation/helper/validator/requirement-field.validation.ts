import { IValidation } from '../../../presentation/interfaces';
import { MissingParamError } from '../../errors';


export class RequiredFieldValidation implements IValidation {
	constructor(private readonly requiredField: string) {}

	// eslint-disable-next-line consistent-return
	validate(object: any): Error | undefined {
		if (!object[this.requiredField]) {
			return new MissingParamError(this.requiredField);
		}
	}
}