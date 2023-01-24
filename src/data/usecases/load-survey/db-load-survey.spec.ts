import DbLoadSurvey from './db-load-survey';
import { ILoadSurveyRepository, ISurveyModel } from './db-load-survey-protocols';


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

const makeLoadSurveyRepository = (): ILoadSurveyRepository => {
	return new (class LoadSurveyRepositoryStub implements ILoadSurveyRepository {
		// eslint-disable-next-line require-await
		async loadAll(): Promise<ISurveyModel[]> {
			return new Promise((resolve) => {
				return resolve(fakeSurveyArr);
			});
		}
	})();
};

interface SutTypes {
	sut: DbLoadSurvey;
	loadSurveyStub: ILoadSurveyRepository;
}

const makeSut = (): SutTypes => {
	const loadSurveyStub = makeLoadSurveyRepository();
	const sut = new DbLoadSurvey(loadSurveyStub);

	return { sut, loadSurveyStub };
};

describe('DbSurvey Usecase', () => {
	let sut: DbLoadSurvey;
	let loadSurveyStub: ILoadSurveyRepository;

	beforeEach(() => {
		({ sut, loadSurveyStub } = makeSut());
	});
	test('Should call loadSurveyRepository with success', async () => {
		const loadSurveyRepositorySpy = jest.spyOn(loadSurveyStub, 'loadAll');

		await sut.load();
		expect(loadSurveyRepositorySpy).toHaveBeenCalled();
	});
	test('Should return a list of surveys success', async () => {
		const surveys = await sut.load();

		expect(surveys).toEqual(fakeSurveyArr);
	});
	test('should throw Error when loadSurveyRepository throws', async () => {
		jest.spyOn(loadSurveyStub, 'loadAll').mockRejectedValueOnce(new Error());

		const promiseLoadccountDb = sut.load();

		await expect(promiseLoadccountDb).rejects.toThrow();
	});
});