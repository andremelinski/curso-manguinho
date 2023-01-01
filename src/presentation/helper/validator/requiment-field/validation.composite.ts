import { IValidation } from './validation.interface';

export class ValidationComposite implements IValidation {
	private readonly validations;

	constructor(validations: IValidation[]) {
		this.validations = validations;
	}

	// eslint-disable-next-line consistent-return
	validate(object: any): Error | null {
		for (const validation of this.validations) {
			const error = validation.validate(object);

			if (error) {
				return error;
			}
		}
	}
}