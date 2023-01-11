import { IValidation } from '../../../presentation/interfaces';

export class ValidationComposite implements IValidation {
	constructor(private readonly validations: IValidation[]) {}

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
