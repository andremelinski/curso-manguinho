/* eslint-disable max-nested-callbacks */
import { hash } from 'bcrypt';
import { Collection } from 'mongodb';
import request from 'supertest';

import { MongoHelper } from '../../infra/database/mongodb/helper/mongo.helper';
import app from '../config/app';

describe('Login Routes', () => {
	let accountCollection: Collection;

	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL);
	});
	beforeEach(async () => {
		accountCollection = await MongoHelper.getCollection('accounts');

		await accountCollection.deleteMany({});
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	describe('POST /signup', () => {
		test('Should return 200 on sign up', async () => {
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

	describe('POST /login', () => {
		test('Should return 200 on login', async () => {
			const password = await hash('valid_password', 12);
			const accountData = {
				name: 'valid_name',
				email: 'valid_email@email.com',
				password,
			};
			const { email } = accountData;

			await accountCollection.insertOne(accountData);
			await request(app)
				.post('/api/login')
				.send({
					email,
					password: 'valid_password',
				})
				.expect(200);
		});

		test('Should return 401 on login', async () => {
			const accountData = {
				name: 'valid_name',
				email: 'valid_email@email.com',
				password: 'valid_password',
			};
			const { email, password } = accountData;

			await accountCollection.insertOne(accountData);

			await request(app)
				.post('/api/login')
				.send({
					email,
					password,
				})
				.expect(401);
		});
	});
});
