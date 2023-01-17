/* eslint-disable max-nested-callbacks */
import { AccessDeniedError } from '../../errors';
import { forbidden, ok, serverError } from '../../helper/http-helper';
import { AuthMiddleware } from './auth-midleware.controller';
import { HttpRequest, IAccountModel, ILoadAccountByToken } from './auth-midleware.protocols';

const correctHttpRequest: HttpRequest = { headers: { 'x-access-token': 'any-token' } };

const fakeAccount = {
	id: 'valid_id',
	name: 'valid_name',
	email: 'valid_email@email.com',
	password: 'hashed_password',
};

const makeLoadAccountByToken = (): ILoadAccountByToken => {
	return new (class loadAccountByTokenStub implements ILoadAccountByToken {
		// eslint-disable-next-line require-await
		async load(accessToken: string, role?: string): Promise<IAccountModel> {
			return new Promise((resolve) => {
				return resolve(fakeAccount);
			});
		}
	})();
};

interface SutTypes {
	sut: AuthMiddleware;
	loadAccountByTokenStub: ILoadAccountByToken;
}
const makeSut = (role ?: string): SutTypes => {
	const loadAccountByTokenStub = makeLoadAccountByToken();
	const sut = new AuthMiddleware(loadAccountByTokenStub, role);

	return { sut, loadAccountByTokenStub };
};


describe('AuthMiddleware', () => {
	let sut: AuthMiddleware;
	let loadAccountByTokenStub: ILoadAccountByToken;

	beforeEach(() => {
		({ sut, loadAccountByTokenStub } = makeSut());
	});
	test('Should return 403 if no x-access-token exists in headers', async () => {
		const httpResponse = await sut.handle({});

		expect(httpResponse).toEqual(forbidden(new AccessDeniedError));
	});
	test('Should loadAccountByToken with correct accessToken', async () => {
		const loadAccountByTokenSpy = jest.spyOn(loadAccountByTokenStub, 'load');

		await sut.handle(correctHttpRequest);

		expect(loadAccountByTokenSpy).toBeCalledWith('any-token', undefined);
	});
	test('Should loadAccountByToken with correct accessToken with role', async () => {
		({ sut, loadAccountByTokenStub } = makeSut('any_role'));
		const loadAccountByTokenSpy = jest.spyOn(loadAccountByTokenStub, 'load');

		await sut.handle(correctHttpRequest);

		expect(loadAccountByTokenSpy).toBeCalledWith('any-token', 'any_role');
	});
	test('Should return 403 if loadAccountByToken returns null', async () => {
		jest.spyOn(loadAccountByTokenStub, 'load').mockResolvedValue(Promise.resolve(null));

		const httpResponse =await sut.handle(correctHttpRequest);

		expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
	});
	test('Should loadAccountByToken with correct accessToken with role', async () => {
		const httpResponse = await sut.handle(correctHttpRequest);

		expect(httpResponse).toEqual(ok({ accountId: 'valid_id' }));
	});
	test('Should return 500 if loadAccountByToken throws', async () => {
		jest.spyOn(loadAccountByTokenStub, 'load').mockRejectedValueOnce(() => {
			return Promise.reject(new Error());
		}
		);
		const httpResponse = await sut.handle(correctHttpRequest);

		expect(httpResponse).toEqual(serverError(new Error()));
	});
});