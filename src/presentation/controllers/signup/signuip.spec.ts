/* eslint-disable max-lines-per-function */
/* eslint-disable max-nested-callbacks */
/* eslint-disable max-classes-per-file */
import { EmailInUseError, MissingParamError, ServerError } from '../../errors';
import { badRequest, forbidden, ok, serverError } from '../../helper/http-helper';
import { IAuthentication, IAuthenticationModel } from '../login/login-protocols';
import { HttpReponse, HttpRequest, IAccountModel, IAddAccount, IAddAccountModel, IValidation } from './signup-protocols';
import { SignUpController } from './signup.controller';

const correctHttpRequest: HttpRequest = {
	body: {
		name: 'valid_name',
		email: 'valid_email@email.com',
		password: 'valid_password',
		passwordConfirmation: 'valid_password',
	},
};

const fakeAccount = {
	id: 'valid_id',
	name: 'valid_name',
	email: 'valid_email@email.com',
	password: 'valid_password',
};

const userToken = 'any_token';

const makeAddAccount = (): IAddAccount => {
	class AddAccountStub implements IAddAccount {
		// eslint-disable-next-line require-await
		async add(account: IAddAccountModel): Promise<IAccountModel> {
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
			return undefined;
		}
	}
	return new ValidationStub();
};

const makeAuthentication = (): IAuthentication => {
	class AuthenticationStub implements IAuthentication {
		// eslint-disable-next-line require-await
		async auth(authentication: IAuthenticationModel): Promise<string> {
			return new Promise((resolve) => {
				return resolve(userToken);
			});
		}
	}
	return new AuthenticationStub();
};

interface SutTypes {
	sut: SignUpController;
	addAccountStub: IAddAccount;
	validationStub: IValidation;
	authenticationStub: IAuthentication;
}
const makeSut = (): SutTypes => {
	const addAccountStub = makeAddAccount();
	const validationStub = makeValidation();
	const authenticationStub = makeAuthentication();
	const sut = new SignUpController(addAccountStub, validationStub, authenticationStub);

	return {
		sut,
		addAccountStub,
		validationStub,
		authenticationStub,
	};
};

describe('Sign Up Controller', () => {
	let sut: SignUpController;
	let addAccountStub: IAddAccount;
	let validationStub: IValidation;
	let authenticationStub: IAuthentication;

	beforeEach(() => {
		({ sut, addAccountStub, validationStub, authenticationStub } = makeSut());
	});

	test('Should call with correct values', async () => {
		const addSpy = jest.spyOn(addAccountStub, 'add');

		await sut.handle(correctHttpRequest);

		expect(addSpy).toHaveBeenCalledWith({
			name: 'valid_name',
			email: 'valid_email@email.com',
			password: 'valid_password',
		});
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
	test('Should return 403 if account already exist', async () => {
		jest
			.spyOn(addAccountStub, 'add').mockResolvedValueOnce(new Promise(resolve => {
				return resolve(null);
			}));
		const httpResponse: HttpReponse = await sut.handle(correctHttpRequest);

		expect(httpResponse).toEqual(forbidden(new EmailInUseError('valid_email@email.com')));
	});
	test('Should return 200 if valid data is provided', async () => {
		const httpResponse: HttpReponse = await sut.handle(correctHttpRequest);

		expect(httpResponse.statusCode).toBe(200);
		expect(httpResponse).toEqual(ok(userToken));
	});
	test('Should call Validation with correct value', async () => {
		const isValidSpy = jest.spyOn(validationStub, 'validate');

		await sut.handle(correctHttpRequest);

		expect(isValidSpy).toHaveBeenCalledWith(correctHttpRequest.body);
	});

	test('Should return 400 if validation return an error', async () => {
		jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'));
		const httpResponse = await sut.handle(correctHttpRequest);

		expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')));
	});
	test('Should call with correct values', async () => {
		const addSpy = jest.spyOn(authenticationStub, 'auth');

		await sut.handle(correctHttpRequest);

		expect(addSpy).toHaveBeenCalledWith({ email: 'valid_email@email.com', password: 'valid_password' });
	});
	test('Should return 500 if Authenticator throws', async () => {
		// eslint-disable-next-line max-nested-callbacks
		jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
			throw new Error();
		});

		const httpResponse: HttpReponse = await sut.handle(correctHttpRequest);

		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse).toEqual(serverError(new Error()));
	});
});
