/* eslint-disable max-classes-per-file */
import { IValidation } from '../../../../presentation/interfaces';
import { InvalidParamError } from '../../../errors';
import { MissingParamError } from '../../../errors/missing-params.error';
import { ValidationComposite } from '../validation.composite';


const makeRequiredFieldValidation = (): IValidation => {
	class RequiredFieldValidationStub implements IValidation {
		validate(object: any): Error {
			return new MissingParamError('required_field');
		}
	}
	return new RequiredFieldValidationStub();
};

const makeCompareFieldValidation = (): IValidation => {
	class CompareFieldValidationStub implements IValidation {
		validate(object: any): Error {
			return new InvalidParamError('field_compared');
		}
	}
	return new CompareFieldValidationStub();
};


interface SutTypes{
    sut: ValidationComposite
    validationStubs: IValidation[]
}

const makeSut = (): SutTypes => {
	const validationStubs = [makeRequiredFieldValidation(), makeCompareFieldValidation()];
	const sut = new ValidationComposite(validationStubs);

	return {
		sut,
		validationStubs,
	};
};

describe('ValidationComposite', () => {
	let sut: ValidationComposite;
	let validationStubs: IValidation[];

	beforeEach(() => {
		({ sut, validationStubs } = makeSut());
	});
	// stub any validation, once they follow same logic
	test('should return an error if any Validaiton fails', () => {
		const error = sut.validate({ field: 'any_field' });

		expect(error).toEqual(new MissingParamError('required_field'));
		expect(error).not.toEqual(new InvalidParamError('field_compared'));
	});

	test('should return an error if compareValidation fails', () => {
		const [fieldValidation] = validationStubs;

		jest.spyOn(fieldValidation, 'validate').mockReturnValueOnce(undefined);
		const error = sut.validate({ field: 'any_field' });

		expect(error).toEqual(new InvalidParamError('field_compared'));
	});

	test('should return undefined if any Validaiton pass', () => {
		const [fieldValidation, compareValidation] = validationStubs;

		jest.spyOn(fieldValidation, 'validate').mockReturnValueOnce(undefined);
		jest.spyOn(compareValidation, 'validate').mockReturnValueOnce(undefined);
		const error = sut.validate({ field: 'any_field' });

		expect(error).toBeFalsy();
		expect(error).toEqual(undefined);
	});
});