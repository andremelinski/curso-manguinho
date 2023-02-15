/* eslint-disable max-nested-callbacks */
import { MongoHelper as sut } from './mongo.helper';

describe('Mongohelper', () => {
	beforeAll(async () => {
		await sut.connect(process.env.MONGO_URL);
	});

	afterAll(async () => {
		await sut.disconnect();
	});
	test('should reconnect when mongodb fall', async () => {
		let accountCollection = await sut.getCollection('accounts');

		await sut.disconnect();
		accountCollection = await sut.getCollection('accounts');
		expect(accountCollection).toBeTruthy();
	});
	describe('connectToCollections', () => {
		test('should reconnect when mongodb fall', async () => {
			const accountCollection = await sut.connectToCollections('accounts');

			expect(accountCollection).toBeTruthy();
		});
		test('should return null when collection does not exist', async () => {
			const accountCollection = await sut.connectToCollections('any');

			expect(accountCollection).toBeUndefined();
		});
	});
});