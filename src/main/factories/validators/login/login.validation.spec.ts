/* eslint-disable max-nested-callbacks */
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../../presentation/helper/validator';
import { IEmailValidator, IValidation } from '../../../../presentation/interfaces';
import { makeLoginValidation } from './login.validation';


jest.mock('../../../../presentation/helper/validator/validation.composite.ts');

const makeEmailValidator = () => {
	class EmailValidatorStub implements IEmailValidator {
		isValid(email: string): boolean {
			return true;
		}
	}
	return new EmailValidatorStub();
};

describe('loginValidaiton Factory', () => {
	test('Should call ValidationComposite with all validations needed', () => {
		makeLoginValidation();
		const requiredFields = ['email', 'password'];
		const validationArr: IValidation[] = [];

		requiredFields.forEach((field: string) => {
			validationArr.push(new RequiredFieldValidation(field));
		});
		validationArr.push(new EmailValidation(makeEmailValidator()));
		expect(ValidationComposite).toHaveBeenCalledWith(validationArr);
	});
});