import { MongoHelper } from '../helper/mongo.helper';
import AccountMongoRepository from './account.repository';

interface SutTypes {
	sut: AccountMongoRepository;
}
const makeSut = (): SutTypes => {
	const sut = new AccountMongoRepository();

	return { sut };
};

describe('Account Mongo Repository', () => {
	let sut: AccountMongoRepository;

	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL);
	});

	beforeEach(async () => {
		const accountCollection = MongoHelper.getCollection('accounts');

		await accountCollection.deleteMany({});

		({ sut } = makeSut());
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});
	test('Should Return an account on success', async () => {
		const accountData = {
			name: 'valid_name',
			email: 'valid_email',
			password: 'hashed_password',
		};

		const newAccount = await sut.add(accountData);

		expect(newAccount).toBeTruthy();
		expect(newAccount.id).toBeTruthy();
		expect(newAccount.name).toEqual('valid_name');
		expect(newAccount.email).toEqual('valid_email');
		expect(newAccount.password).toEqual('hashed_password');
	});
});
