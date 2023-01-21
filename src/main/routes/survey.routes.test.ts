/* eslint-disable max-nested-callbacks */
import { hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Collection, ObjectId } from 'mongodb';
import request from 'supertest';

import { IAddSurveyDto } from '../../domain/interfaces/usecases/survey/add-survey.interface';
import { MongoHelper } from '../../infra/database/mongodb/helper/mongo.helper';
import app from '../config/app';
import env from '../config/env';

const surveyData: IAddSurveyDto = {
	question: 'any_question',
	answers: [{ image: 'Image 1', answer: 'Answer 1' }, { answer: 'Answer 2' }],
};

const secretSecretKey = env.JWT_SECRET_KEY;

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
		test('Should return 200 on surveys', async () => {
			const password = await hash('valid_password', 12);
			const accountData = {
				name: 'valid_name',
				email: 'valid_email@email.com',
				password,
				role: 'admin'
			};

			const { insertedId } = await accountCollection.insertOne(accountData);
			const accessToken = sign({ id: insertedId }, secretSecretKey);

			await accountCollection.updateOne(
				{ _id: new ObjectId(insertedId) },
				{ $set: { accessToken } }
			);

			await request(app).post('/api/surveys')
				.set('x-access-token', accessToken)
				.send(surveyData)
				.expect(204);
		});
	});

	describe('POST /surveys', () => {
		test('Should return 403 on surveys', async () => {
			const surveyData: IAddSurveyDto = {
				question: 'any_question',
				answers: [{ image: 'Image 1', answer: 'Answer 1' }, { answer: 'Answer 2' }],
			};

			await request(app).post('/api/surveys')
				.send(surveyData)
				.expect(403);
		});
	});
});
