/* eslint-disable max-classes-per-file */
import { IAuthentication } from '../../../domain/interfaces/usecases/authentication.interface';
import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, serverError, unauthorized } from '../../helper/http-helper';
import { HttpReponse, HttpRequest } from '../../http/http';
import { IEmailValidator } from '../../interfaces';
import LoginController from './login.controller';

const validHttpRequest: HttpRequest = {
	body: {
		email: 'valid_email@email.com',
		password: 'valid_password',
	},
};

const makeAuthentication = (): IAuthentication => {
	class AuthenticationStub implements IAuthentication {
		// eslint-disable-next-line require-await
		async auth(email: string, password: string): Promise<string> {
			return new Promise(resolve => {
				return resolve('any_token');
			});
		}
	}
	return new AuthenticationStub();
};

const emailValidatorStub = (): IEmailValidator => {
	class EmailValidatorStub implements IEmailValidator {
		isValid(email: string): boolean {
			return true;
		}
	}
	return new EmailValidatorStub();
};

interface SutType {
	sut: LoginController;
	emailValidator: IEmailValidator;
	makeAuthenticationStub: IAuthentication;
}

const makeSut = (): SutType => {
	const emailValidator = emailValidatorStub();
	const makeAuthenticationStub = makeAuthentication();
	const sut = new LoginController(emailValidator, makeAuthenticationStub);

	return { sut, emailValidator, makeAuthenticationStub };
};

describe('Login Controller', () => {
	let sut: LoginController;
	let emailValidator: IEmailValidator;
	let makeAuthenticationStub: IAuthentication;

	beforeEach(() => {
		({ sut, emailValidator, makeAuthenticationStub } = makeSut());
	});
	test('Should return 400 if no email is provided', async () => {
		const httpRequest: HttpRequest = { body: { password: 'valid_password', }, };

		const httpResponse: HttpReponse = await sut.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
	});
	test('Should return 400 if no password is provided', async () => {
		const httpRequest: HttpRequest = { body: { email: 'valid_email' } };

		const httpResponse: HttpReponse = await sut.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
	});

	test('Should call EmailValidator', async () => {
		const isValidSpy = jest.spyOn(emailValidator, 'isValid');

		await sut.handle(validHttpRequest);

		expect(isValidSpy).toHaveBeenLastCalledWith(validHttpRequest.body.email);
	});

	test('Should return 400 if email is invalid', async () => {
		jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false);
		const httpRequest: HttpRequest = { body: { email: 'invalid_email', password: 'valid_password' } };

		const httpResponse: HttpReponse = await sut.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
	});

	test('Should return 500 if Email Validator throws', async () => {
		// eslint-disable-next-line max-nested-callbacks
		jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
			throw new Error();
		}
		);
		const httpRequest: HttpRequest = { body: { email: 'invalid_email', password: 'valid_password' } };

		const httpResponse: HttpReponse = await sut.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse).toEqual(serverError(new Error()));
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

		const httpResponse: HttpReponse = await sut.handle(validHttpRequest);

		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse).toEqual(serverError(new Error()));
	});

	test('Should return 200 if valid credentials', async () => {
		const httpResponse: HttpReponse = await sut.handle(validHttpRequest);

		expect(httpResponse).toEqual({ body: 'any_token', statusCode : 200 });
	});
});