import { IValidation } from '../../../presentation/interfaces';
import { InvalidParamError } from '../../errors';


export class CompareFieldValidation implements IValidation {
	constructor(private readonly fieldName: string, private readonly fieldToCompare: string) {}

	// eslint-disable-next-line consistent-return
	validate(object: any): Error | undefined {
		if (object[this.fieldName] !== object[this.fieldToCompare]) {
			return new InvalidParamError(this.fieldToCompare);
		}
	}
}