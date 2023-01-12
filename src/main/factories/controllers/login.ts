import LoginController from '../../../presentation/controllers/login/login/login.controller';
import { IController } from '../../../presentation/http/controller.interface';
import { makeLogControllerDecorator } from '../decorator/log-controller-decorator-factory';
import { makeLoginValidation } from '../login/login.validation';
import { makeDbAuthentication } from '../usecases/authentication/db-authentication.factory';

export const makeLoginController = (): IController => {
	const loginController = new LoginController(makeDbAuthentication(), makeLoginValidation());

	return makeLogControllerDecorator(loginController);
};