/* eslint-disable max-nested-callbacks */
import { hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Collection, ObjectId } from 'mongodb';
import request from 'supertest';

import { MongoHelper } from '../../infra/database/mongodb/helper/mongo.helper';
import { correctSurveyHttpRequest } from '../../utils/constant/mock.constant';
import app from '../config/app';
import env from '../config/env';

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

			await request(app)
				.post('/api/surveys')
				.set('x-access-token', accessToken)
				.send(correctSurveyHttpRequest.body)
				.expect(204);
		});
	});

	describe('POST /surveys', () => {
		test('Should return 403 on surveys', async () => {
			await request(app).post('/api/surveys')
				.send(correctSurveyHttpRequest.body)
				.expect(403);
		});
	});
});
