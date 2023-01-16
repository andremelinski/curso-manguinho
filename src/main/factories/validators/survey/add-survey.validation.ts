import { RequiredFieldValidation, ValidationComposite } from '../../../../presentation/helper/validator';
import { IValidation } from '../../../../presentation/interfaces';

export const makeAddSurveyValidation = (): ValidationComposite => {
	const requiredFields = ['question', 'answers'];
	const validationArr: IValidation[] = [];

	requiredFields.forEach((requiredField) => {
		validationArr.push(new RequiredFieldValidation(requiredField));
	});
	return new ValidationComposite(validationArr);
};