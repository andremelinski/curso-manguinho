import { correctSurveyHttpRequest } from '../../../../utils/constant/mock.constant';
import DbAddSurvey from './db-add-survey';
import { IAddSurvey, IAddSurveyDto, IAddSurveyRepository } from './db-add-survey-protocols';


jest.useFakeTimers().setSystemTime(new Date());

const fakeSurveyData: IAddSurveyDto = {
	...correctSurveyHttpRequest.body,
	date: new Date(),
};

const makeAddSurveyRepository = (): IAddSurveyRepository => {
	return new (class AddSurveyRepositoryStub implements IAddSurveyRepository {
		// eslint-disable-next-line require-await
		async add(data: IAddSurveyDto): Promise<void> {
			return new Promise((resolve) => {
				return resolve();
			});
		}
	})();
};

interface SutTypes {
    sut: DbAddSurvey,
    addSurveyStub: IAddSurvey
}

const makeSut = (): SutTypes => {
	const addSurveyStub = makeAddSurveyRepository();
	const sut = new DbAddSurvey(addSurveyStub);

	return { sut, addSurveyStub };
};

describe('DbSurvey Usecase', () => {
	let sut: DbAddSurvey;
	let addSurveyStub: IAddSurvey;

	beforeEach(() => {
		({ sut, addSurveyStub } = makeSut());
	});
	test('Should call AddSurveyRepository with success', async () => {
		const addSurveyRepositorySpy = jest.spyOn(addSurveyStub, 'add');

		await sut.add(fakeSurveyData);
		expect(addSurveyRepositorySpy).toHaveBeenCalledWith(fakeSurveyData);
	});
	test('should throw Error when AddSurveyRepository throws', async () => {
		jest.spyOn(addSurveyStub, 'add').mockRejectedValueOnce(new Error());

		const promiseAddccountDb = sut.add(fakeSurveyData);

		await expect(promiseAddccountDb).rejects.toThrow();
	});
});