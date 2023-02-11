/* eslint-disable max-classes-per-file */
import { InvalidParamError } from '../../../errors/invalid-params.erros';
import { forbidden } from '../../../helper/http-helper';
import SaveSurveyResultController from './save-survey-result.controller';
import {
	HttpRequest,
	ILoadSurveyById,
	ISaveSurveyResult,
	ISaveSurveyResultDto,
	ISurveyModel,
	ISurveyResultModel,
} from './save-survey-result.protocols';

jest.useFakeTimers().setSystemTime(new Date());

const makeFakeRequest : HttpRequest = { params: { surveyId: 'survey_id' } };

const fakeSurvey: ISurveyModel = {
	id: 'valid_id',
	question: 'valid_question',
	answers: [{ image: 'any_image', answer: 'any_answer' }, { answer: 'any_answer2' }],
	date: new Date(),
};

const fakeSurveyResult: ISurveyResultModel = {
	id: 'valid_id',
	surveyId: 'valid_survey_id',
	accountId: 'valid_account_id',
	answer: 'any_answer',
	date: new Date(),
};

const makeLoadSurveyById = (): ILoadSurveyById => {
	return new (class LoadSurveyByIdStub implements ILoadSurveyById {
		loadById(_id: string): Promise<ISurveyModel> {
			return new Promise((resolve) => {
				return resolve(fakeSurvey);
			});
		}
	})();
};

const makeSaveSurveyResult = (): ISaveSurveyResult => {
	return new (class SaveSurveyResultStub implements ISaveSurveyResult {
		// eslint-disable-next-line require-await
		async save(data: ISaveSurveyResultDto): Promise<ISurveyResultModel> {
			return new Promise((resolve) => {
				return resolve(fakeSurveyResult);
			});
		}
	})();
};

interface SutTypes {
	sut: SaveSurveyResultController;
	loadSurveyByIdStub: ILoadSurveyById;
	saveSurveyResultStub: ISaveSurveyResult;
}

const makeSut = (): SutTypes => {
	const loadSurveyByIdStub = makeLoadSurveyById();
	const saveSurveyResultStub = makeSaveSurveyResult();
	const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub);

	return { sut, loadSurveyByIdStub, saveSurveyResultStub };
};

describe('SaveSurveyResultController', () => {
	let sut: SaveSurveyResultController;
	let loadSurveyByIdStub: ILoadSurveyById;
	let saveSurveyResultStub: ISaveSurveyResult;

	beforeEach(() => {
		({ sut, loadSurveyByIdStub, saveSurveyResultStub } = makeSut());
	});
	test('should call loadSurveyById with correct values', async () => {
		const loadSurveyByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');

		await sut.handle(makeFakeRequest);

		expect(loadSurveyByIdSpy).toHaveBeenCalledWith('survey_id');
	});
	test('should return 403 if loadSurveyById returns null', async () => {
		jest.spyOn(loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(null);

		const surveyResult = await sut.handle(makeFakeRequest);

		expect(surveyResult).toEqual(forbidden(new InvalidParamError('survey_id')));
	});
});