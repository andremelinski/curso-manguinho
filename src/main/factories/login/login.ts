import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication';
import BcryptAdapter from '../../../infra/criptograph/bcrypt-adapter/bcrypt-adapter';
import JwtAdapter from '../../../infra/criptograph/jwt-adapter/jwt-adapter';
import AccountMongoRepository from '../../../infra/database/mongodb/account-repository/account.repository';
import LoginController from '../../../presentation/controllers/login/login.controller';
import { IController } from '../../../presentation/http/controller.interface';
import env from '../../config/env';
import { LogControllerDecorator } from '../../decorator/logController.decorator';
import { makeLoginValidation } from './login.validation';

export const makeLoginController = (): IController => {
	const salt = 12;

	const accountMongoRepository = new AccountMongoRepository();
	const bcryptAdapter = new BcryptAdapter(salt);
	const jwtAdapter = new JwtAdapter(env.JWT_SECRET_KEY);
	const authentication = new DbAuthentication(
		accountMongoRepository,
		bcryptAdapter,
		jwtAdapter,
		accountMongoRepository
	);
	const loginController = new LoginController(authentication, makeLoginValidation());

	return new LogControllerDecorator(loginController);
};