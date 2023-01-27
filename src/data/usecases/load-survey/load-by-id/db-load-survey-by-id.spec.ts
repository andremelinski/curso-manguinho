import { ILoadSurveyById } from '../../../../domain/interfaces/usecases/survey/load-surveys.interface';
import DbLoadSurveyById from './db-load-survey-by-id';
import { ISurveyModel } from './db-load-survey-by-id.protocols';

const fakeSurvey: ISurveyModel = {
	id: 'valid_id',
	question: 'valid_question',
	answers: [{ image: 'any_image', answer: 'any_answer' }, { answer: 'any_answer2' }],
	date: new Date(),
};

jest.useFakeTimers().setSystemTime(new Date());

const makeILoadSurveyByIdRepository = (): ILoadSurveyById => {
	return new (class ILoadSurveyByIdStub implements ILoadSurveyById {
		// eslint-disable-next-line require-await
		async loadById(): Promise<ISurveyModel> {
			return new Promise((resolve) => {
				return resolve(fakeSurvey);
			});
		}
	})();
};

interface SutTypes {
	sut: DbLoadSurveyById;
	loadSurveyByIdStub: ILoadSurveyById;
}

const makeSut = (): SutTypes => {
	const loadSurveyByIdStub = makeILoadSurveyByIdRepository();
	const sut = new DbLoadSurveyById(loadSurveyByIdStub);

	return { sut, loadSurveyByIdStub };
};

describe('DbSurvey Usecase', () => {
	let sut: DbLoadSurveyById;
	let loadSurveyByIdStub: ILoadSurveyById;

	beforeEach(() => {
		({ sut, loadSurveyByIdStub } = makeSut());
	});
	test('Should call loadSurveyByIdRepository with success', async () => {
		const loadSurveyByIdRepositorySpy = jest.spyOn(loadSurveyByIdStub, 'loadById');

		await sut.loadById(fakeSurvey.id);
		expect(loadSurveyByIdRepositorySpy).toHaveBeenCalledWith('valid_id');
	});
	test('Should return a survey on success', async () => {
		const surveys = await sut.loadById('valid_id');

		expect(surveys).toEqual(fakeSurvey);
	});
	test('should throw Error when loadSurveyByIdRepository throws', async () => {
		jest.spyOn(loadSurveyByIdStub, 'loadById').mockRejectedValueOnce(new Error());

		const promiseLoadccountDb = sut.loadById(fakeSurvey.id);

		await expect(promiseLoadccountDb).rejects.toThrow();
	});
});