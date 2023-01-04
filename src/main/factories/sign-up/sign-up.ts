import DbAddAccount from '../../../data/usecases/add-account/db-add-account';
import BcryptAdapter from '../../../infra/criptograph/bcrypt-adapter/bcrypt-adapter';
import AccountMongoRepository from '../../../infra/database/mongodb/account-repository/account.repository';
import { SignUpController } from '../../../presentation/controllers/signup/signup.controller';
import { IController } from '../../../presentation/http';
import { LogControllerDecorator } from '../../decorator/logController.decorator';
import { makeSignUpValidation } from './sign-up.validation';

export const makeSignUpController = (): IController => {
	const salt = 12;
	const accountMongoRepository = new AccountMongoRepository();
	const bcryptAdapter = new BcryptAdapter(salt);
	const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
	const signUpController = new SignUpController(dbAddAccount, makeSignUpValidation());

	return new LogControllerDecorator(signUpController);
};