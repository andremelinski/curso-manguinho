/* eslint-disable max-classes-per-file */
/* eslint-disable max-nested-callbacks */
import { InvalidParamError } from '../../../errors';
import { IEmailValidator } from '../../../interfaces';
import { EmailValidation } from '../mail-validator.validation';


const bodyRequest = {
	name: 'andre',
	email: 'any_email@email.com',
	password: 'a123',
	passwordConfirmation: 'invalid',
};

const makeEmailValidator = (): IEmailValidator => {
	class EmailValidatorStub implements IEmailValidator {
		isValid(email: string): boolean {
			return true;
		}
	}
	return new EmailValidatorStub();
};

interface ISutTypes {
	emailValidatorStub: IEmailValidator;
	sut: EmailValidation;
}
const makeSut = (): ISutTypes => {
	const emailValidatorStub = makeEmailValidator();
	const sut = new EmailValidation(emailValidatorStub);

	return { sut, emailValidatorStub };
};

describe('Email Validation', () => {
	let sut: EmailValidation;
	let emailValidatorStub: IEmailValidator;

	beforeEach(() => {
		({ sut, emailValidatorStub } = makeSut());
	});

	test('Should return InvalidParamError if invalid email is provided', () => {
		jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
		const bodyRequest = {
			name: 'andre',
			email: 'invalid_email',
			password: 'a123',
			passwordConfirmation: 'a123',
		};

		const mailValidation = sut.validate(bodyRequest);

		expect(mailValidation).toEqual(new InvalidParamError('email'));
	});

	test('Should call email validator with correct email', () => {
		const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

		sut.validate(bodyRequest);

		expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com');
	});

	test('Should throw if EmailValidator throws', () => {
		jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
			throw new Error('stack_error');
		});
		expect(sut.validate).toThrow();
	});
});
