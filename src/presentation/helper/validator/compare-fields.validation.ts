import { IValidation } from '../../../presentation/interfaces';
import { InvalidParamError } from '../../errors';


export class CompareFieldValidation implements IValidation {
	private readonly fieldName;

	private readonly fieldToCompare;

	constructor(fieldName: string, fieldToCompare: string) {
		this.fieldName = fieldName;
		this.fieldToCompare = fieldToCompare;
	}

	// eslint-disable-next-line consistent-return
	validate(object: any): Error | undefined {
		if (object[this.fieldName] !== object[this.fieldToCompare]) {
			return new InvalidParamError(this.fieldToCompare);
		}
	}
}