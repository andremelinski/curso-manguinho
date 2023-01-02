/* eslint-disable max-lines-per-function */
/* eslint-disable max-nested-callbacks */
/* eslint-disable max-classes-per-file */
import { ServerError } from '../../errors';
import { IAccountModel, IAddAccount, IAddAccountModel, IValidation } from './signup-protocols';
import { SignUpController } from './signup.controller';

const correctHttpRequest = {
	body: {
		name: 'andre',
		email: 'any_email@email.com',
		password: 'a123',
		passwordConfirmation: 'a123',
	}
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
	addAccountStub: IAddAccount;
	validationStub: IValidation;
}
const makeSut = (): SutTypes => {
	const addAccountStub = makeAddAccount();
	const validationStub = makeValidation();
	const sut = new SignUpController(addAccountStub, validationStub);

	return {
		sut,
		addAccountStub,
		validationStub,
	};
};

describe('Sign Up Controller', () => {
	let sut: SignUpController;
	let addAccountStub: IAddAccount;
	let validationStub: IValidation;

	beforeEach(() => {
		({ sut, addAccountStub, validationStub } = makeSut());
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
});
