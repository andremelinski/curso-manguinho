import validator from 'validator';

import EmailValidatorAdapter from './email-validator';

const anyMail = 'any_email@email.com';
const wrongEmail = 'wrong_email@.com';
const validMail = 'valid_email@email.com';
const makeSut = (): EmailValidatorAdapter => {
	return new EmailValidatorAdapter();
};

// mocking lib result to always return true
jest.mock('validator', () => {
	return {
		isEmail(): boolean {
			return true;
		},
	};
});

describe('EmailValidatorAdapter', () => {
	let sut: EmailValidatorAdapter;

	beforeAll(() => {
		sut = makeSut();
	});
	test('Should return false if validator returns false', () => {
		// spy the validator lib and in the isEmail method mock the return to false
		jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
		const isValid = sut.isValid(wrongEmail);

		expect(isValid).toBe(false);
	});

	test('Should return true if validator returns true', () => {
		const isValid = sut.isValid(validMail);

		expect(isValid).toBe(true);
	});

	test('Should call validator with correct email', () => {
		const isEmailSpy = jest.spyOn(validator, 'isEmail');

		sut.isValid(anyMail);

		expect(isEmailSpy).toHaveBeenCalledWith(anyMail);
	});
});
