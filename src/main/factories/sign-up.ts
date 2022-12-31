import { SignUpController } from '../../presentation/controllers/signup/signup.controller';
import EmailValidatorAdapter from '../../utils/email-validator';
import DbAddAccount from '../../data/usecases/add-account/db-add-account';
import BcryptAdapter from '../../infra/criptograph/bcrypt-adapter';
import AccountMongoRepository from '../../infra/database/mongodb/account-repository/account.repository';
import { IController } from '../../presentation/http';
import { LogControllerDecorator } from '../decorator/logController.decorator';

export const makeSignUpController = (): IController => {
	const salt = 12;
	const emailValidatorAdapter = new EmailValidatorAdapter();
	const accountMongoRepository = new AccountMongoRepository();
	const bcryptAdapter = new BcryptAdapter(salt);
	const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
	const signUpController = new SignUpController(emailValidatorAdapter, dbAddAccount);

	return new LogControllerDecorator(signUpController);
};