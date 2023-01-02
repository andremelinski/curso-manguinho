import CompareFieldValidation from '../../presentation/helper/validator/compare-fields.validation';
import EmailValidation from '../../presentation/helper/validator/mail-validator.validation';
import { RequiredFieldValidation } from '../../presentation/helper/validator/requirement-field.validation';
import { ValidationComposite } from '../../presentation/helper/validator/validation.composite';
import { IValidation } from '../../presentation/helper/validator/validation.interface';
import { IEmailValidator } from '../../presentation/interfaces';
import { makeSignUpValidation } from './sign-up.validation';


jest.mock('../../presentation/helper/validator/validation.composite.ts');

const makeEmailValidator = () => {
	class EmailValidatorStub implements IEmailValidator {
		isValid(email: string): boolean {
			return true;
		}
	}
	return new EmailValidatorStub();
};

describe('SignUpValidation Factory', () => {
	test('Should call ValidationComposite with all validations', () => {
		makeSignUpValidation();
		const requiredFields = ['email', 'name', 'password', 'passwordConfirmation'];
		const validationArr: IValidation[] = [];

		// eslint-disable-next-line max-nested-callbacks
		requiredFields.forEach((requiredField) => {
			validationArr.push(new RequiredFieldValidation(requiredField));
		});
		validationArr.push(new CompareFieldValidation('password', 'passwordConfirmation'));
		validationArr.push(new EmailValidation(makeEmailValidator()));
		expect(ValidationComposite).toHaveBeenCalledWith(validationArr);
	});
});