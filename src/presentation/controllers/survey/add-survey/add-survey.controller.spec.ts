/* eslint-disable max-classes-per-file */
import { MissingParamError } from '../../../errors';
import { badRequest, noContent, serverError } from '../../../helper/http-helper';
import { HttpReponse, HttpRequest, IAddSurvey, IAddSurveyDto, IValidation } from './add-surver-protocols';
import AddSurveyController from './add-survey.controller';


const correctHttpRequest: HttpRequest = {
	body: {
		question: 'any_question',
		answers: [{ image: 'any_image', answer: 'any_answer' }]

	},
};

// const fakeSurvey = {
// 	id: 'valid_id',
// 	question: 'valid_question',
// 	answer: 'valid_answer',
// };

const makeValidation = (): IValidation => {
	return new class ValidationComposite implements IValidation {
		validate(object: any): Error {
			return undefined;
		}
	};
};

const makeAddSurvey = (): IAddSurvey => {
	return new class AddSurveyStub implements IAddSurvey {
		// eslint-disable-next-line require-await
		async add(data: IAddSurveyDto): Promise<void> {
			return new Promise((resolve) => {
				return resolve();
			});
		}
	};
};

interface SutTypes {
	sut: AddSurveyController;
	validationStub: IValidation;
	addSurveyStub: IAddSurvey;
}

const makeSut = (): SutTypes => {
	const addSurveyStub = makeAddSurvey();
	const validationStub = makeValidation();
	const sut = new AddSurveyController(addSurveyStub, validationStub);

	return { sut, validationStub, addSurveyStub };
};

describe('Add Survey Controller', () => {
	let sut: AddSurveyController;
	let validationStub: IValidation;
	let addSurveyStub: IAddSurvey;

	beforeEach(() => {
		({ sut, validationStub, addSurveyStub } = makeSut());
	});
	test('should call validationStub with correct data', async () => {
		const validationSpyOn = jest.spyOn(validationStub, 'validate');

		await sut.handle(correctHttpRequest);

		expect(validationSpyOn).toHaveBeenCalledWith({
			answers: [{ answer: 'any_answer', image: 'any_image' }],
			question: 'any_question',
		});
	});
	test('Should return 500 if AddSurveyController throws', async () => {
		// eslint-disable-next-line require-await
		jest.spyOn(addSurveyStub, 'add').mockRejectedValueOnce(new Error('Async error'));
		const httpResponse = await sut.handle(correctHttpRequest);

		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse).toEqual(serverError(new Error()));
	});
	test('Should return 400 if validation return an error', async () => {
		jest.spyOn(validationStub, 'validate').mockReturnValueOnce(
			new MissingParamError('any_field')
		);
		const httpResponse = await sut.handle(correctHttpRequest);

		expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')));
	});
	test('should call AddSurvey with correct data', async () => {
		const addSurveySpyOn = jest.spyOn(addSurveyStub, 'add');

		await sut.handle(correctHttpRequest);

		expect(addSurveySpyOn).toHaveBeenCalledWith({
			question: 'any_question',
			answers: [{ image: 'any_image', answer: 'any_answer' }]

		});
	});
	test('should return 204 on success', async () => {
		const httpResponse: HttpReponse = await sut.handle(correctHttpRequest);

		expect(httpResponse).toEqual(noContent());
	});
});