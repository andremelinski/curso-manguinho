import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication';
import AccountMongoRepository from '../../../infra/database/mongodb/account-repository/account.repository';
import LoginController from '../../../presentation/controllers/login/login.controller';
import { IController } from '../../../presentation/http/controller.interface';
import { LogControllerDecorator } from '../../decorator/logController.decorator';
import { makeLoginValidation } from './login.validation';

export const makeLoginController = (): IController => {
	const accountMongoRepository = new AccountMongoRepository();
	const authentication = new DbAuthentication(accountMongoRepository);
	const loginController = new LoginController(authentication, makeLoginValidation());

	return new LogControllerDecorator(loginController);
};