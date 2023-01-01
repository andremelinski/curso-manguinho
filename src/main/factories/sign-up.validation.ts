import { RequiredFieldValidation } from '../../presentation/helper/validator/requiment-field/requirement-field.validation';
import { ValidationComposite } from '../../presentation/helper/validator/requiment-field/validation.composite';
import { IValidation } from '../../presentation/helper/validator/requiment-field/validation.interface';

export const makeSignUpValidation = (): ValidationComposite => {
	const requiredFields = ['email', 'name', 'password', 'passwordConfirmation'];
	const validationArr : IValidation[] = [];

	requiredFields.forEach((requiredField) => {
		validationArr.push(new RequiredFieldValidation(requiredField));
	});
	return new ValidationComposite(validationArr);
};