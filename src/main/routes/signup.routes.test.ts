/* eslint-disable max-nested-callbacks */
import request from 'supertest';

import { MongoHelper } from '../../infra/database/mongodb/helper/mongo.helper';
import app from '../config/app';

describe('Sign up Routes', () => {
	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL);
	});
	beforeEach(async () => {
		const accountCollection = MongoHelper.getCollection('accounts');

		await accountCollection.deleteMany({});
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});
	test('Should return an accont on succes', async () => {
		const accountData = {
			name: 'valid_name',
			email: 'valid_email@email.com',
			password: 'valid_password',
			passwordConfirmation: 'valid_password',
		};

		await request(app).post('/api/signup')
			.send(accountData)
			.expect(200);
	});
});
