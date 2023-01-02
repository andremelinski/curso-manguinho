import { MissingParamError } from '../../../errors';
import { RequiredFieldValidation } from '../requirement-field.validation';

describe('Compare Fields Validation', () => {
	const validationFieldObject = { fieldToBeValidate: 'fieldValue', };

	it('Should return a InvalidParamError if Validation fails', () => {
		const compareVlidation = new RequiredFieldValidation('randomfield');

		const isValid = compareVlidation.validate(validationFieldObject);

		expect(isValid).toEqual(new MissingParamError('randomfield'));
	});
	it('Should return undefined if Validation is correct', () => {
		const validationFieldObject = { fieldToBeValidate: 'fieldValue' };

		const compareVlidation = new RequiredFieldValidation('fieldToBeValidate');

		const isValid = compareVlidation.validate(validationFieldObject);

		expect(isValid).toBeFalsy();
		expect(isValid).toEqual(undefined);
	});
});
