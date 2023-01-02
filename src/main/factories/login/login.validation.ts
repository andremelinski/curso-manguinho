import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../presentation/helper/validator';
import { IValidation } from '../../../presentation/interfaces';
import EmailValidatorAdapter from '../../../utils/email-validator';


export const makeLoginValidation = (): ValidationComposite => {
	const requiredFields = ['email', 'password'];
	const validationArr: IValidation[] = [];

	requiredFields.forEach((field: string) => {
		validationArr.push(new RequiredFieldValidation(field));
	});
	validationArr.push(new EmailValidation(new EmailValidatorAdapter()));

	return new ValidationComposite(validationArr);
};