import { SignUpController } from '../../../presentation/controllers/login/signup/signup.controller';
import { IController } from '../../../presentation/http';
import { makeLogControllerDecorator } from '../decorator/log-controller-decorator-factory';
import { makeSignUpValidation } from '../sign-up/sign-up.validation';
import { makeDbAddAccount } from '../usecases/add-account/db-add-account.factory';
import { makeDbAuthentication } from '../usecases/authentication/db-authentication.factory';

export const makeSignUpController = (): IController => {
	const signUpController = new SignUpController(
		makeDbAddAccount(),
		makeSignUpValidation(),
		makeDbAuthentication()
	);

	return makeLogControllerDecorator(signUpController);
};