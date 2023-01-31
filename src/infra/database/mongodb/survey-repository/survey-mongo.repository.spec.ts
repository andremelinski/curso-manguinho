/* eslint-disable max-nested-callbacks */
import { Collection } from 'mongodb';

import { IAddAccountDto } from '../../../../domain/interfaces/usecases/addAccount.interface';
import { IAddSurveyDto } from '../../../../domain/interfaces/usecases/survey/add-survey.interface';
import { MongoHelper } from '../helper/mongo.helper';
import SurveyMongoRepository from './survey-mongo.repository';

const accountData = (): IAddAccountDto => {
	return {
		name: 'valid_name',
		email: 'valid_email',
		password: 'hashed_password',
	};
};

const fakeSurveyData: IAddSurveyDto = {
	question: 'any_question',
	answers: [{ image: 'any_image', answer: 'any_answer' }, { answer: 'any_answer2' }],
	date: new Date(),
};

const fakeSurveyDataArr: IAddSurveyDto[] = [
	{
		question: 'valid_question',
		answers: [{ image: 'any_image', answer: 'any_answer' }, { answer: 'any_answer2' }],
		date: new Date(),
	},
	{
		question: 'valid_question2',
		answers: [{ image: 'any_image3', answer: 'any_answer3' }, { answer: 'any_answer4' }],
		date: new Date(),
	},
];

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
	let surveyResultCollection: Collection;
	let accountCollection: Collection;

	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL);
	});

	beforeEach(async () => {
		surveyCollection = await MongoHelper.getCollection('surveys');
		surveyResultCollection = await MongoHelper.getCollection('surveyResults');
		accountCollection = await MongoHelper.getCollection('accounts');
		await surveyCollection.deleteMany({});
		await surveyResultCollection.deleteMany({});
		await accountCollection.deleteMany({});

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
	test('Should load all surveys on success', async () => {
		await surveyCollection.insertMany(fakeSurveyDataArr);
		const surveys = await sut.loadAll();

		expect(surveys.length).toBeGreaterThan(0);
	});
	test('Should load empty list', async () => {
		const surveys = await sut.loadAll();

		expect(surveys.length).toEqual(0);
	});
	test('Should find a survey by id', async () => {
		const survey = await surveyCollection.insertOne(fakeSurveyDataArr[0]);
		const surveyFound = await sut.loadById(survey.insertedId.toString());

		expect(surveyFound).toBeTruthy();
		expect(surveyFound.id).toBeTruthy();
	});
	describe('save()', () => {
		test('Should add a survey result if its new', async () => {
			const { insertedId: accountId } = await accountCollection.insertOne(accountData());
			const fakeSurvey = fakeSurveyDataArr[0];
			const { insertedId: surveyId } = await surveyCollection.insertOne(fakeSurvey);

			const [{ answer }] = fakeSurvey.answers;
			const surveyResult = await sut.save({
				surveyId: surveyId.toString(),
				accountId: accountId.toString(),
				answer,
				date: new Date(),
			});

			expect(surveyResult).toBeTruthy();
			expect(surveyResult.id).toBeTruthy();
			expect(surveyResult.answer).toEqual(answer);
		});
		test('Should update a survey result if already exist', async () => {
			const { insertedId: accountId } = await accountCollection.insertOne(
				accountData()
			);
			const fakeSurvey = fakeSurveyDataArr[0];
			const { insertedId: surveyId } = await surveyCollection.insertOne(fakeSurvey);

			const [{ answer }, { answer: answer2 }] = fakeSurvey.answers;

			await sut.save({
				surveyId: surveyId.toString(),
				accountId: accountId.toString(),
				answer,
				date: new Date(),
			});
			const surveyResult = await sut.save({
				surveyId: surveyId.toString(),
				accountId: accountId.toString(),
				answer: answer2,
				date: new Date(),
			});

			expect(surveyResult).toBeTruthy();
			expect(surveyResult.id).toBeTruthy();
			expect(surveyResult.answer).toEqual(answer2);
		});
	});
});
