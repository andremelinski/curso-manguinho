import { AccessDeniedError } from '../../errors/access-denied.erros';
import { forbidden } from '../../helper/http-helper';
import { AuthMiddleware } from './auth-midleware.controller';

interface SutTypes {
	sut: AuthMiddleware;
}
const makeSut = (): SutTypes => {
	const sut = new AuthMiddleware();

	return { sut };
};


describe('AuthMiddleware', () => {
	let sut: AuthMiddleware;

	beforeEach(() => {
		({ sut } = makeSut());
	});
	test('Should return 403 if no x-access-token exists in headers', async () => {
		const httpResponse = await sut.handle({});

		expect(httpResponse).toEqual(forbidden(new AccessDeniedError));
	});
});