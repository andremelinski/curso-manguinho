/* eslint-disable max-nested-callbacks */
import { sign } from 'jsonwebtoken';
import { Collection, ObjectId } from 'mongodb';
import request from 'supertest';

import { IAddSurveyDto } from '../../data/usecases/survey/add-survey/db-add-survey-protocols';
import { MongoHelper } from '../../infra/database/mongodb/helper/mongo.helper';
import { HttpReponse } from '../../presentation/http';
import { correctSurveyHttpRequest } from '../../utils/constant/mock.constant';
import app from '../config/app';
import env from '../config/env';

const secretSecretKey = env.JWT_SECRET_KEY;
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
const accountData = {
	name: 'valid_name',
	email: 'valid_email@email.com',
	password: 'valid_password'
};

describe('Survey Routes', () => {
	let accountCollection: Collection;
	let surveyCollection: Collection;

	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL);
	});
	beforeEach(async () => {
		surveyCollection = await MongoHelper.getCollection('surveys');
		accountCollection = await MongoHelper.getCollection('accounts');
		await surveyCollection.deleteMany({});
		await accountCollection.deleteMany({});
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	describe('POST /surveys', () => {
		test('Should return 204 on surveys', async () => {
			const adminAccountData = {
				...accountData,
				role: 'admin',
			};

			const { insertedId } = await accountCollection.insertOne(adminAccountData);
			const accessToken = sign({ id: insertedId }, secretSecretKey);

			await accountCollection.updateOne(
				{ _id: new ObjectId(insertedId) },
				{ $set: { accessToken } }
			);

			await request(app)
				.post('/api/surveys')
				.set('x-access-token', accessToken)
				.send(correctSurveyHttpRequest.body)
				.expect(204);
		});
		test('Should return 403 on surveys', async () => {
			await request(app).post('/api/surveys')
				.send(correctSurveyHttpRequest.body)
				.expect(403);
		});
	});

	describe('GET /surveys', () => {
		test('Should return 200 and load surveys', async () => {
			const { insertedId } = await accountCollection.insertOne(accountData);
			const accessToken = sign({ id: insertedId }, secretSecretKey);

			await accountCollection.updateOne(
				{ _id: new ObjectId(insertedId) },
				{ $set: { accessToken } }
			);
			await surveyCollection.insertMany(fakeSurveyDataArr);

			const response: HttpReponse = await request(app)
				.get('/api/surveys')
				.set('x-access-token', accessToken)
				.send(correctSurveyHttpRequest.body);

			expect(response.statusCode).toEqual(200);
			expect(response.body.length).toBeGreaterThan(0);
		});
		test('Should return 204 if survey not found', async () => {
			const { insertedId } = await accountCollection.insertOne(accountData);
			const accessToken = sign({ id: insertedId }, secretSecretKey);

			await accountCollection.updateOne(
				{ _id: new ObjectId(insertedId) },
				{ $set: { accessToken } }
			);

			const response: HttpReponse = await request(app)
				.get('/api/surveys')
				.set('x-access-token', accessToken)
				.send(correctSurveyHttpRequest.body);

			expect(response.statusCode).toEqual(204);
		});
	});
});
