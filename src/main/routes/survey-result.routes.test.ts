/* eslint-disable max-nested-callbacks */
import { Collection } from 'mongodb';
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
		// test('Should return 204 on save survey result with correct token', async () => {
		// 	const adminAccountData = {
		// 		...accountData,
		// 		role: 'admin',
		// 	};

		// 	const { insertedId } = await accountCollection.insertOne(adminAccountData);
		// 	const accessToken = sign({ id: insertedId }, secretSecretKey);

		// 	await accountCollection.updateOne(
		// 		{ _id: new ObjectId(insertedId) },
		// 		{ $set: { accessToken } }
		// 	);

		// 	const survey = await surveyCollection.insertOne(fakeSurveyData);

		// 	console.log(survey.insertedId.toString());
		// 	await request(app).put(`/api/surveys/${survey.insertedId.toString()}/results`)
		// 		.set('x-access-token', accessToken)
		// 		.send({ answer: 'answer' })
		// 		.expect(204);
		// });
		test('Should return 403 on save survey result without accessToken', async () => {
			await request(app)
				.put('/api/surveys/any_id/results')
				.send({ answer: 'answer' })
				.expect(403);
		});
	});
});
