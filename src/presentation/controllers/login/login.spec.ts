/* eslint-disable max-classes-per-file */
import { MissingParamError } from '../../errors';
import { badRequest, serverError, unauthorized } from '../../helper/http-helper';
import { HttpReponse, HttpRequest, IAuthentication, IAuthenticationDto, IValidation } from './login-protocols';
import LoginController from './login.controller';

/* eslint-disable max-classes-per-file */
const correctHttpRequest: HttpRequest = {
	body: {
		email: 'valid_email@email.com',
		password: 'valid_password',
	},
};

jest.mock('../../helper/validator/validation.composite.ts');

const makeValidation = (): IValidation => {
	// if any error occurs, return error, else do nothing (return null)
	class ValidationStub implements IValidation {
		validate(object: any): Error {
			return null;
		}
	}
	return new ValidationStub();
};

const makeAuthentication = (): IAuthentication => {
	class AuthenticationStub implements IAuthentication {
		// eslint-disable-next-line require-await
		async auth(authentication: IAuthenticationDto): Promise<string> {
			return new Promise((resolve) => {
				return resolve('any_token');
			});
		}
	}
	return new AuthenticationStub();
};


interface SutType {
	sut: LoginController;
	makeAuthenticationStub: IAuthentication;
	validationStub: IValidation;
}

const makeSut = (): SutType => {
	const makeAuthenticationStub = makeAuthentication();
	const validationStub = makeValidation();
	const sut = new LoginController(makeAuthenticationStub, validationStub);

	return { sut, makeAuthenticationStub, validationStub };
};

describe('Login Controller', () => {
	let sut: LoginController;
	let makeAuthenticationStub: IAuthentication;
	let validationStub: IValidation;

	beforeEach(() => {
		({ sut, makeAuthenticationStub, validationStub } = makeSut());
	});

	test('Should call with correct values', async () => {
		const addSpy = jest.spyOn(makeAuthenticationStub, 'auth');

		await sut.handle(correctHttpRequest);

		expect(addSpy).toHaveBeenCalledWith(correctHttpRequest.body);
	});

	test('Should return 401 if invalid credentials', async () => {
		jest.spyOn(makeAuthenticationStub, 'auth').mockReturnValueOnce(null);
		const httpRequest: HttpRequest = { body: { email: 'invalid_email', password: 'invalid_password' }, };

		const httpResponse: HttpReponse = await sut.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(401);
		expect(httpResponse).toEqual(unauthorized());
	});

	test('Should return 500 if Authenticator throws', async () => {
		// eslint-disable-next-line max-nested-callbacks
		jest.spyOn(makeAuthenticationStub, 'auth').mockImplementationOnce(() => {
			throw new Error();
		});

		const httpResponse: HttpReponse = await sut.handle(correctHttpRequest);

		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse).toEqual(serverError(new Error()));
	});

	test('Should return 200 if valid credentials', async () => {
		const httpResponse: HttpReponse = await sut.handle(correctHttpRequest);

		expect(httpResponse).toEqual({ body: 'any_token', statusCode : 200 });
	});

	test('Should call Validation with correct value', async () => {
		const isValidSpy = jest.spyOn(validationStub, 'validate');

		await sut.handle(correctHttpRequest);

		expect(isValidSpy).toHaveBeenCalledWith(correctHttpRequest.body);
	});

	test('Should return 400 if validation return an error', async () => {
		jest.spyOn(validationStub, 'validate').mockReturnValueOnce(
			new MissingParamError('any_field')
		);
		const httpResponse = await sut.handle(correctHttpRequest);

		expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')));
	});
});