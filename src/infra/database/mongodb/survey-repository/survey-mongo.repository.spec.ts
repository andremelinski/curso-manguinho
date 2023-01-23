import { Collection } from 'mongodb';

import { IAddSurveyDto } from '../../../../domain/interfaces/usecases/survey/add-survey.interface';
import { MongoHelper } from '../helper/mongo.helper';
import SurveyMongoRepository from './survey-mongo.repository';

const fakeSurveyData: IAddSurveyDto = {
	question: 'any_question',
	answers: [{ image: 'any_image', answer: 'any_answer' }, { answer: 'any_answer2' }],
	date: new Date(),
};


interface SutTypes {
	sut: SurveyMongoRepository;
}
const makeSut = (): SutTypes => {
	const sut = new SurveyMongoRepository();

	return { sut };
};

describe('Survey Mongo Repository', () => {
	let sut: SurveyMongoRepository;
	let surveyCollection: Collection;

	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL);
	});

	beforeEach(async () => {
		surveyCollection = await MongoHelper.getCollection('surveys');

		await surveyCollection.deleteMany({});

		({ sut } = makeSut());
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	test('Should add a survey on success', async () => {
		await sut.add(fakeSurveyData);
		const surveyCount = await surveyCollection.countDocuments();

		expect(surveyCount).toBeGreaterThan(0);
	});
});
