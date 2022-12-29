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
});