import { InvalidParamError } from '../../errors';
import { IValidation } from './validation.interface';


export default class CompareFieldValidation implements IValidation {
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