/* eslint-disable max-nested-callbacks */
/* eslint-disable max-classes-per-file */
import { InvalidParamError, MissingParamError, ServerError } from '../../errors';
import { IAccountModel, IAddAccount, IAddAccountModel, IEmailValidator } from './signup-protocols';
import { SignUpController } from './signup.controller';

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

interface SutTypes {
	sut: SignUpController;
	emailValidatorStub: IEmailValidator;
	addAccountStub: IAddAccount;
}
const makeSut = (): SutTypes => {
	const emailValidatorStub = makeEmailValidator();
	const addAccountStub = makeAddAccount();
	const sut = new SignUpController(emailValidatorStub, addAccountStub);

	return {
		sut,
		emailValidatorStub,
		addAccountStub,
	};
};

describe('Sign Up Controller', () => {
	let sut: SignUpController;
	let emailValidatorStub: IEmailValidator;
	let addAccountStub: IAddAccount;

	beforeEach(() => {
		({ sut, emailValidatorStub, addAccountStub } = makeSut());
	});
	test('Should return 400 if no name is provided', async () => {
		const httpRequest = {
			body: {
				email: 'andre@email.com',
				password: 'a123',
				passwordConfirmation: 'a123',
			},
		};

		const httpResponse = await sut.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError('name'));
	});
	test('Should return 400 if no email is provided', async () => {
		const httpRequest = {
			body: {
				name: 'andre',
				password: 'a123',
				passwordConfirmation: 'a123',
			},
		};

		const httpResponse = await sut.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError('email'));
	});
	test('Should return 400 if no password is provided', async () => {
		const httpRequest = {
			body: {
				name: 'andre',
				email: 'andre@email.com',
				passwordConfirmation: 'a123',
			},
		};

		const httpResponse = await sut.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError('password'));
	});
	test('Should return 400 if no passwordConfirmation is provided', async () => {
		const httpRequest = {
			body: {
				name: 'andre',
				email: 'andre@email.com',
				password: 'a123',
			},
		};

		const httpResponse = await sut.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'));
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
		const httpRequest = {
			body: {
				name: 'andre',
				email: 'any_email@email.com',
				password: 'a123',
				passwordConfirmation: 'a123',
			},
		};

		const httpResponse = await sut.handle(httpRequest);

		expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com');
	});

	test('Should return 500 if EmailValidator throws', async () => {
		jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
			throw new Error('');
		});
		const sut = new SignUpController(emailValidatorStub, addAccountStub);
		const httpRequest = {
			body: {
				name: 'andre',
				email: 'any_email@email.com',
				password: 'a123',
				passwordConfirmation: 'a123',
			},
		};

		const httpResponse = await sut.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse.body).toEqual(new ServerError());
	});

	test('Should return 500 if AddAccount throws', async () => {
		// eslint-disable-next-line require-await
		jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
			return new Promise((resolve, reject) => {
				return reject(new Error(''));
			});
		});
		const sut = new SignUpController(emailValidatorStub, addAccountStub);
		const httpRequest = {
			body: {
				name: 'andre',
				email: 'any_email@email.com',
				password: 'a123',
				passwordConfirmation: 'a123',
			},
		};

		const httpResponse = await sut.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse.body).toEqual(new ServerError());
	});
	test('Should call with correct values', async () => {
		const addSpy = jest.spyOn(addAccountStub, 'add');
		const httpRequest = {
			body: {
				name: 'andre',
				email: 'any_email@email.com',
				password: 'a123',
				passwordConfirmation: 'a123',
			},
		};

		const httpResponse = await sut.handle(httpRequest);

		expect(addSpy).toHaveBeenCalledWith({
			name: 'andre',
			email: 'any_email@email.com',
			password: 'a123',
		});
		// expect(httpResponse.statusCode).toBe(500);
		// expect(httpResponse.body).toEqual(new ServerError());
	});

	test('Should return 200 if valid data is provided', async () => {
		const httpRequest = {
			body: {
				name: 'andre',
				email: 'any_email@email.com',
				password: 'a123',
				passwordConfirmation: 'a123',
			},
		};

		const httpResponse = await sut.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(200);
		// expect(httpResponse.body).toEqual(new ServerError());
	});
});
