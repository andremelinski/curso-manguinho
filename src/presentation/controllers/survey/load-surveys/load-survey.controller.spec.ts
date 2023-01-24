import { noContent, ok, serverError } from '../../../helper/http-helper';
import { ILoadSurveys, ISurveyModel } from './load-surveys-protocols';
import LoadSurveysController from './load-surveys.controller';

const fakeSurveyArr: ISurveyModel[] = [
	{
		id: 'valid_id',
		question: 'valid_question',
		answers: [{ image: 'any_image', answer: 'any_answer' }, { answer: 'any_answer2' }],
		date: new Date(),
	},
	{
		id: 'valid_id2',
		question: 'valid_question2',
		answers: [{ image: 'any_image3', answer: 'any_answer3' }, { answer: 'any_answer4' }],
		date: new Date(),
	},
];

jest.useFakeTimers().setSystemTime(new Date());

const makeLoadSurveys = (): ILoadSurveys => {
	return new (class LoadSurveyStub implements ILoadSurveys {
		// eslint-disable-next-line require-await
		async load(): Promise<ISurveyModel[]> {
			return new Promise((resolve) => {
				return resolve(fakeSurveyArr);
			});
		}
	})();
};

interface SutTypes {
	sut: LoadSurveysController;
	loadSurveysStub: ILoadSurveys;
}

const makeSut = (): SutTypes => {
	const loadSurveysStub = makeLoadSurveys();
	const sut = new LoadSurveysController(loadSurveysStub);

	return { sut, loadSurveysStub };
};

describe('Load Surveys Controller', () => {
	let sut: LoadSurveysController;
	let loadSurveysStub: ILoadSurveys;

	beforeEach(() => {
		({ sut, loadSurveysStub } = makeSut());
	});
	test('should call LoadSurveysController', async () => {
		const loadSurveysSpy = jest.spyOn(loadSurveysStub, 'load');

		await sut.handle({});
		expect(loadSurveysSpy).toHaveBeenCalled();
	});
	test('should return 200 and surveys', async () => {
		const httpResponse = await sut.handle({});

		expect(httpResponse).toEqual(ok(fakeSurveyArr));
	});
	test('should return 204 if no content', async () => {
		jest.spyOn(loadSurveysStub, 'load').mockResolvedValueOnce(
			new Promise((resolve) => {
				return resolve([]);
			})
		);
		const httpResponse = await sut.handle({});

		expect(httpResponse).toEqual(noContent());
	});
	test('Should return 500 if LoadSurveysController throws', async () => {
		// eslint-disable-next-line require-await
		jest.spyOn(loadSurveysStub, 'load').mockRejectedValueOnce(new Error('Async error'));
		const httpResponse = await sut.handle({});

		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse).toEqual(serverError(new Error()));
	});
});