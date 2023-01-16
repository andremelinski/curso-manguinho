/* eslint-disable max-nested-callbacks */
import { Collection } from 'mongodb';
import request from 'supertest';

import { IAddSurveyDto } from '../../domain/interfaces/usecases/survey/add-survey.interface';
import { MongoHelper } from '../../infra/database/mongodb/helper/mongo.helper';
import app from '../config/app';

describe('Survey Routes', () => {
	let surveyCollection: Collection;

	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL);
	});
	beforeEach(async () => {
		surveyCollection = await MongoHelper.getCollection('surveys');

		await surveyCollection.deleteMany({});
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	describe('POST /surveys', () => {
		test('Should return 200 on surveys', async () => {
			const surveyData: IAddSurveyDto = {
				question: 'any_question',
				answers: [{ image: 'Image 1', answer: 'Answer 1' }, { answer: 'Answer 2' }],
			};

			await request(app).post('/api/surveys')
				.send(surveyData)
				.expect(204);
		});
	});
});
