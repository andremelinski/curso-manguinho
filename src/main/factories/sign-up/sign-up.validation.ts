import {
	CompareFieldValidation,
	EmailValidation,
	RequiredFieldValidation,
	ValidationComposite,
} from '../../../presentation/helper/validator';
import { IValidation } from '../../../presentation/interfaces';
import EmailValidatorAdapter from '../../../utils/email-validator';


export const makeSignUpValidation = (): ValidationComposite => {
	const requiredFields = ['email', 'name', 'password', 'passwordConfirmation'];
	const validationArr: IValidation[] = [];

	requiredFields.forEach((requiredField) => {
		validationArr.push(new RequiredFieldValidation(requiredField));
	});
	validationArr.push(new CompareFieldValidation('password', 'passwordConfirmation'));
	validationArr.push(new EmailValidation(new EmailValidatorAdapter()));
	return new ValidationComposite(validationArr);
};