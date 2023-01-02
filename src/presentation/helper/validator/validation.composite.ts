import { IValidation } from '../../../presentation/interfaces';

export class ValidationComposite implements IValidation {
	private readonly validations;

	constructor(validations: IValidation[]) {
		this.validations = validations;
	}

	// eslint-disable-next-line consistent-return
	validate(object: any): Error | undefined {
		for (const validation of this.validations) {
			const error = validation.validate(object);

			if (error) {
				return error;
			}
		}
	}
}
