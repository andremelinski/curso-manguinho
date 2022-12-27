/* eslint-disable max-nested-callbacks */
import request from 'supertest';

import app from '../config/app';

describe('Sign up Routes', () => {
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
