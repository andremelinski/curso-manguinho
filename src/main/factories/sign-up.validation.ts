import CompareFieldValidation from '../../presentation/helper/validator/compare-fields.validation';
import EmailValidation from '../../presentation/helper/validator/mail-validator.validation';
import { RequiredFieldValidation } from '../../presentation/helper/validator/requirement-field.validation';
import { ValidationComposite } from '../../presentation/helper/validator/validation.composite';
import { IValidation } from '../../presentation/helper/validator/validation.interface';
import EmailValidatorAdapter from '../../utils/email-validator';

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