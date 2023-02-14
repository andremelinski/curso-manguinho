/* eslint-disable max-nested-callbacks */
import { sign } from 'jsonwebtoken';
import { Collection, ObjectId } from 'mongodb';
import request from 'supertest';

import { IAddSurveyDto } from '../../data/usecases/survey/add-survey/db-add-survey-protocols';
import { MongoHelper } from '../../infra/database/mongodb/helper/mongo.helper';
import app from '../config/app';
import env from '../config/env';

const secretSecretKey = env.JWT_SECRET_KEY;

const fakeSurveyData: IAddSurveyDto = {
	question: 'valid_question1',
	answers: [{ image: 'any_image2', answer: 'any_answer1' }, { answer: 'any_answer2' }],
	date: new Date(),
};
const accountData = {
	name: 'valid_name',
	email: 'valid_email@email.com',
	password: 'valid_password',
};

describe('Survey Routes', () => {
	let accountCollection: Collection;
	let surveyCollection: Collection;
	let surveyResultCollection: Collection;

	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL);
	});
	beforeEach(async () => {
		surveyCollection = await MongoHelper.getCollection('surveys');
		accountCollection = await MongoHelper.getCollection('accounts');
		surveyResultCollection = await MongoHelper.getCollection('surveyResults');
		await surveyCollection.deleteMany({});
		await accountCollection.deleteMany({});
		await surveyResultCollection.deleteMany({});
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	describe('PUT /surveys/:surveyId/results', () => {
		test('Should return 204 on surveys', async () => {
			const { insertedId } = await accountCollection.insertOne(accountData);
			const accessToken = sign({ id: insertedId }, secretSecretKey);

			await accountCollection.updateOne({ _id: new ObjectId(insertedId) }, { $set: { accessToken } });
			const survey = await surveyCollection.insertOne(fakeSurveyData);

			const surveyResult = await request(app)
				.put(`/api/surveys/${survey.insertedId.toString()}/results`)
				.set('x-access-token', accessToken)
				.send({ answer: 'any_answer1' });

			expect(surveyResult.statusCode).toEqual(200);
			expect(surveyResult.body).toHaveProperty('accountId');
			expect(surveyResult.body).toHaveProperty('surveyId');
			expect(surveyResult.body).toHaveProperty('answer');
			expect(surveyResult.body).toHaveProperty('id');
		});
		test('Should return 403 on save survey result without accessToken', async () => {
			await request(app)
				.put('/api/surveys/any_id/results')
				.send({ answer: 'answer' })
				.expect(403);
		});
	});
});
