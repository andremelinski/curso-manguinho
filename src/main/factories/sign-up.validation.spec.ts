import { RequiredFieldValidation } from '../../presentation/helper/validator/requiment-field/requirement-field.validation';
import { ValidationComposite } from '../../presentation/helper/validator/requiment-field/validation.composite';
import { IValidation } from '../../presentation/helper/validator/requiment-field/validation.interface';
import { makeSignUpValidation } from './sign-up.validation';


jest.mock('../../presentation/helper/validator/requiment-field/validation.composite.ts');
describe('SignUpValidation Factory', () => {
	test('Should call ValidationComposite with all validations', () => {
		makeSignUpValidation();
		const requiredFields = ['email', 'name', 'password', 'passwordConfirmation'];
		const validationArr: IValidation[] = [];

		// eslint-disable-next-line max-nested-callbacks
		requiredFields.forEach((requiredField) => {
			validationArr.push(new RequiredFieldValidation(requiredField));
		});
		expect(ValidationComposite).toHaveBeenCalledWith(validationArr);
	});
});