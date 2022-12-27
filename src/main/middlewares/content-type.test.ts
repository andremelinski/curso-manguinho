import request from 'supertest';

import app from '../config/app';


/* eslint-disable max-nested-callbacks */
describe('Content Type Middleware', () => {
// if is not a json, null will be returned
	test('Should return default content type as json', async () => {
		app.get('/test_content_type', (req, res) => {
			res.send('');
		});
		await request(app).get('/test_content_type')
			.expect('content-type', /json/);
	});
	test('Should return xml when forced', async () => {
		app.get('/test_content_type_xml', (req, res) => {
			res.type('xml');
			res.send('');
		});
		await request(app).get('/test_content_type_xml')
			.expect('content-type', /xml/);
	});
});
