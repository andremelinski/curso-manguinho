/* eslint-disable max-nested-callbacks */
import request from 'supertest';

import app from '../config/app';
import { noCache } from './no-cache-swagger';

describe('Nocache Swagger', () => {
	test('Should disable Cache on Swagger', async () => {
		app.get('/test_no_cache', noCache, (req, res) => {
			res.send(req.body);
		});
		await request(app)
			.get('/test_no_cache')
			.expect('cache-control', 'no-cache, no-store, must-revalidate, proxy-revalidate')
			.expect('pragma', 'no-cache')
			.expect('expires', '0')
			.expect('surrogate-control', 'no-store');
	});
});
