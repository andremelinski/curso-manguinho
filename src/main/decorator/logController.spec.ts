import { HttpRequest, HttpReponse, IController } from '../../presentation/http';
import { LogControllerDecorator } from './logController.decorator';

const controller = (): IController => {
	class ControllerStub implements IController {
		// eslint-disable-next-line require-await
		async handle(httpRequest: HttpRequest): Promise<HttpReponse> {
			const httpReponse: HttpReponse = {
				body: {
					id: 'valid_id',
					email: 'valid_email@email',
					username: 'valid_username',
					password: 'valid_password',
				},
				statusCode: 200,
			};

			return new Promise((resolve) => {
				return resolve(httpReponse);
			});
		}
	}
	return new ControllerStub();
};

interface SutTypes {
	sut: IController;
	controllerStub: IController;
}

const makeSut = (): SutTypes => {
	const controllerStub = controller();
	const sut = new LogControllerDecorator(controllerStub);

	return {
		sut,
		controllerStub,
	};
};


describe('Decorator logController', () => {
	let sut: IController;
	let controllerStub: IController;

	beforeEach(() => {
		({ sut, controllerStub } = makeSut());
	});
	test('should call handle from controller', async () => {
		const httpRequest: HttpRequest = {
			body: {
				email: 'valid_email@email',
				username: 'valid_username',
				password: 'valid_password',
				passwordConfirmation: 'valid_password',
			},
		};

		const handleSpy = jest.spyOn(controllerStub, 'handle');

		await sut.handle(httpRequest);

		expect(handleSpy).toHaveBeenCalledWith(httpRequest);
	});
	test('should return the same result of the controller', async () => {
		const httpRequest: HttpRequest = {
			body: {
				email: 'valid_email@email',
				username: 'valid_username',
				password: 'valid_password',
				passwordConfirmation: 'valid_password',
			},
		};


		const userInfo = await sut.handle(httpRequest);
		const {
			body: { email, id, password, username },
			statusCode,
		} = userInfo;

		expect(email).toEqual('valid_email@email');
		expect(id).toEqual('valid_id');
		expect(password).toEqual('valid_password');
		expect(username).toEqual('valid_username');
		expect(statusCode).toEqual(200);
	});
});