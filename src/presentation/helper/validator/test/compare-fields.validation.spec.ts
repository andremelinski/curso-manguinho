import { InvalidParamError } from '../../../errors';
import CompareFieldValidation from '../compare-fields.validation';

describe('Compare Fields Validation', () => {
	it('Should return a InvalidParamError if Validation fails', () => {
		const compareObject = {
			password: 'valid_password',
			passwordConfirmation: 'invalid_password',
		};

		const compareVlidation = new CompareFieldValidation('password', 'passwordConfirmation');

		const isValid = compareVlidation.validate(compareObject);

		expect(isValid).toEqual(new InvalidParamError('passwordConfirmation'));
	});
	it('Should return a null if Validation is correct', () => {
		const compareObject = {
			password: 'valid_password',
			passwordConfirmation: 'valid_password',
		};

		const compareVlidation = new CompareFieldValidation('password', 'passwordConfirmation');

		const isValid = compareVlidation.validate(compareObject);

		expect(isValid).toBeFalsy();
		expect(isValid).toEqual(undefined);
	});
});