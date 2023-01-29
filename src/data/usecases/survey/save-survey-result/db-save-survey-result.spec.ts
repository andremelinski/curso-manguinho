import DbSaveSurveyResult from './db-save-survey';
import { ISaveSurveyResultDto, ISaveSurveyResultRepository, ISurveyResultModel } from './db-save-survey-result-protocols';

jest.useFakeTimers().setSystemTime(new Date());

const fakeSurveyResultDto: ISaveSurveyResultDto = {
	surveyId: 'any_SurveyId',
	accountId: 'any_accountId',
	answer: 'any_answer',
	date: new Date(),
};
const fakeSurveyData: ISurveyResultModel = {
	id: 'any_id',
	...fakeSurveyResultDto,
};

const makeSaveSurveyResultRepository = (): ISaveSurveyResultRepository => {
	return new (class saveSurveyResultStub implements ISaveSurveyResultRepository {
		// eslint-disable-next-line require-await
		async save(data: ISaveSurveyResultDto): Promise<ISurveyResultModel> {
			return new Promise((resolve) => {
				return resolve(fakeSurveyData);
			});
		}
	})();
};

interface SutTypes {
	sut: DbSaveSurveyResult;
	saveSurveyStub: ISaveSurveyResultRepository;
}

const makeSut = (): SutTypes => {
	const saveSurveyStub = makeSaveSurveyResultRepository();
	const sut = new DbSaveSurveyResult(saveSurveyStub);

	return { sut, saveSurveyStub };
};

describe('DbSaveSurveyResult Usecase', () => {
	let sut: DbSaveSurveyResult;
	let saveSurveyStub: ISaveSurveyResultRepository;

	beforeEach(() => {
		({ sut, saveSurveyStub } = makeSut());
	});
	test('Should call SaveSurveyResult with success', async () => {
		const saveSurveyResultSpy = jest.spyOn(saveSurveyStub, 'save');

		await sut.save(fakeSurveyResultDto);
		expect(saveSurveyResultSpy).toHaveBeenCalledWith(fakeSurveyResultDto);
	});
	test('should throw Error when SaveSurveyResult throws', async () => {
		jest.spyOn(saveSurveyStub, 'save').mockRejectedValueOnce(new Error());

		const promiseAddccountDb = sut.save(fakeSurveyData);

		await expect(promiseAddccountDb).rejects.toThrow();
	});
	test('should return a Survey Result Data on Success', async () => {
		const survey = await sut.save(fakeSurveyResultDto);

		expect(survey).toEqual(fakeSurveyData);
	});
});
