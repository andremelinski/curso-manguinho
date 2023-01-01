/* eslint-disable max-lines-per-function */
/* eslint-disable max-nested-callbacks */
/* eslint-disable max-classes-per-file */
import { InvalidParamError, MissingParamError, ServerError } from '../../errors';
import { badRequest } from '../../helper/http-helper';
import { IAccountModel, IAddAccount, IAddAccountModel, IEmailValidator, IValidation } from './signup-protocols';
import { SignUpController } from './signup.controller';

const correctHttpRequest = {
	body: {
		name: 'andre',
		email: 'any_email@email.com',
		password: 'a123',
		passwordConfirmation: 'a123',
	}
};
const makeEmailValidator = () => {
	class EmailValidatorStub implements IEmailValidator {
		isValid(email: string): boolean {
			return true;
		}
	}
	return new EmailValidatorStub();
};

const makeAddAccount = (): IAddAccount => {
	class AddAccountStub implements IAddAccount {
		// eslint-disable-next-line require-await
		async add(account: IAddAccountModel): Promise<IAccountModel> {
			const fakeAccount = {
				id: 'valid_id',
				name: 'valid_name',
				email: 'valid_email@email.com',
				password: 'valid_password',
			};

			return new Promise((resolve, reject) => {
				return resolve(fakeAccount);
			});
		}
	}
	return new AddAccountStub();
};

const makeValidation = (): IValidation => {
	// if any error occurs, return error, else do nothing (return null)
	class ValidationStub implements IValidation {
		validate(object: any): Error {
			return null;
		}
	}
	return new ValidationStub();
};

interface SutTypes {
	sut: SignUpController;
	emailValidatorStub: IEmailValidator;
	addAccountStub: IAddAccount;
	validationStub: IValidation;
}
const makeSut = (): SutTypes => {
	const emailValidatorStub = makeEmailValidator();
	const addAccountStub = makeAddAccount();
	const validationStub = makeValidation();
	const sut = new SignUpController(emailValidatorStub, addAccountStub, validationStub);

	return {
		sut,
		emailValidatorStub,
		addAccountStub,
		validationStub,
	};
};

describe('Sign Up Controller', () => {
	let sut: SignUpController;
	let emailValidatorStub: IEmailValidator;
	let addAccountStub: IAddAccount;
	let validationStub: IValidation;

	beforeEach(() => {
		({ sut, emailValidatorStub, addAccountStub, validationStub } = makeSut());
	});

	test('Should return 400 if passwordConfirmation failed', async () => {
		const httpRequest = {
			body: {
				name: 'andre',
				email: 'andre@email.com',
				password: 'a123',
				passwordConfirmation: 'invalid',
			},
		};

		const httpResponse = await sut.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'));
	});

	test('Should return 400 if invalid email is provided', async () => {
		jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
		const httpRequest = {
			body: {
				name: 'andre',
				email: 'invalid_email@email.com',
				password: 'a123',
				passwordConfirmation: 'a123',
			},
		};

		const httpResponse = await sut.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new InvalidParamError('email'));
	});

	test('Should call email validator with correct email', async () => {
		const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

		await sut.handle(correctHttpRequest);

		expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com');
	});

	test('Should return 500 if EmailValidator throws', async () => {
		jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
			throw new Error('stack_error');
		});
		const httpResponse = await sut.handle(correctHttpRequest);

		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse.body).toEqual(new ServerError('stack_error'));
	});

	test('Should return 500 if AddAccount throws', async () => {
		// eslint-disable-next-line require-await
		jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
			return new Promise((resolve, reject) => {
				return reject(new Error('stack Error'));
			});
		});
		const httpResponse = await sut.handle(correctHttpRequest);

		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse.body).toEqual(new ServerError('stack Error'));
	});
	test('Should call with correct values', async () => {
		const addSpy = jest.spyOn(addAccountStub, 'add');

		await sut.handle(correctHttpRequest);

		expect(addSpy).toHaveBeenCalledWith({
			name: 'andre',
			email: 'any_email@email.com',
			password: 'a123',
		});
	});

	test('Should return 200 if valid data is provided', async () => {
		const httpResponse = await sut.handle(correctHttpRequest);

		expect(httpResponse.statusCode).toBe(200);
	});
	test('Should return 200 if valid data is provided', async () => {
		const isValidSpy = jest.spyOn(validationStub, 'validate');

		await sut.handle(correctHttpRequest);

		expect(isValidSpy).toHaveBeenCalledWith(correctHttpRequest.body);
	});

	test('Should return 400 if validation returns an error', async () => {
		jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'));
		const httpResponse = await sut.handle(correctHttpRequest);

		expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')));
	});
});
