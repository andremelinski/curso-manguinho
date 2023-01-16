import { RequiredFieldValidation, ValidationComposite } from '../../../../presentation/helper/validator';
import { IValidation } from '../../../../presentation/interfaces';
import { makeAddSurveyValidation } from './add-survey.validation';

jest.mock('../../../../presentation/helper/validator/validation.composite.ts');


describe('SignUpValidation Factory', () => {
	test('Should call ValidationComposite with all validations', () => {
		makeAddSurveyValidation();
		const requiredFields = ['question', 'answers'];
		const validationArr: IValidation[] = [];

		// eslint-disable-next-line max-nested-callbacks
		requiredFields.forEach((requiredField) => {
			validationArr.push(new RequiredFieldValidation(requiredField));
		});
		expect(ValidationComposite).toHaveBeenCalledWith(validationArr);
	});
});
