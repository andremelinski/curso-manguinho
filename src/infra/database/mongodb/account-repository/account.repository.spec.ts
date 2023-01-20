import { Collection } from 'mongodb';

import { IAddAccountDto } from '../../../../domain/interfaces/usecases/addAccount.interface';
import { MongoHelper } from '../helper/mongo.helper';
import AccountMongoRepository from './account.repository';

const token = 'any_token';
const accountData = ():IAddAccountDto => {
	return {
		name: 'valid_name',
		email: 'valid_email',
		password: 'hashed_password',
	};
};
const userWithToken = { ...accountData(), accessToken: 'valid_token', role: 'any_role' };

interface SutTypes {
	sut: AccountMongoRepository;
}
const makeSut = (): SutTypes => {
	const sut = new AccountMongoRepository();

	return { sut };
};

describe('Account Mongo Repository', () => {
	let sut: AccountMongoRepository;
	let accountCollection: Collection;

	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL);
	});

	beforeEach(async () => {
		accountCollection = await MongoHelper.getCollection('accounts');

		await accountCollection.deleteMany({});

		({ sut } = makeSut());
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	test('Should Return an account on add success', async () => {
		const newAccount = await sut.add(accountData());

		expect(newAccount).toBeTruthy();
		expect(newAccount.id).toBeTruthy();
		expect(newAccount.name).toEqual('valid_name');
		expect(newAccount.email).toEqual('valid_email');
		expect(newAccount.password).toEqual('hashed_password');
	});
	test('Should Return an account on loadByEmail success', async () => {
		await accountCollection.insertOne(accountData());
		const userAccount = await sut.loadByEmail(accountData().email);

		expect(userAccount).toBeTruthy();
		expect(userAccount.id).toBeTruthy();
		expect(userAccount.name).toEqual('valid_name');
		expect(userAccount.email).toEqual('valid_email');
		expect(userAccount.password).toEqual('hashed_password');
	});
	test('Should Return null if loadByEmail fails', async () => {
		const userAccount = await sut.loadByEmail(accountData().email);

		expect(userAccount).toBeFalsy();
	});
	test('Should update the account with accessToken on updateAccessToken success', async () => {
		const account = await accountCollection.insertOne(accountData());

		expect(account).toBeTruthy();
		let userFound = await accountCollection.findOne({ _id: account.insertedId });
		const userId = userFound._id.toString();

		expect(userFound.email).toEqual(accountData().email);
		expect(userFound.accessToken).toBeFalsy();
		await sut.updateAccessToken(userId, token);
		userFound = await accountCollection.findOne({ _id: account.insertedId });

		expect(userFound.accessToken).toEqual(token);
	});
	test('Should Return an account on loadByToken success without role', async () => {
		const userWithToken = { ...accountData(), accessToken: 'valid_token' };

		await accountCollection.insertOne(userWithToken);
		const userAccount = await sut.loadByToken('valid_token');

		expect(userAccount).toBeTruthy();
		expect(userAccount.id).toBeTruthy();
		expect(userAccount.name).toEqual('valid_name');
		expect(userAccount.email).toEqual('valid_email');
		expect(userAccount.password).toEqual('hashed_password');
	});
	test('Should Return an account on loadByToken success with role', async () => {
		await accountCollection.insertOne(userWithToken);
		const userAccount = await sut.loadByToken('valid_token', 'any_role');

		expect(userAccount).toBeTruthy();
		expect(userAccount.id).toBeTruthy();
		expect(userAccount.name).toEqual('valid_name');
		expect(userAccount.email).toEqual('valid_email');
		expect(userAccount.password).toEqual('hashed_password');
	});
	test('Should Return null if loadByToken fails', async () => {
		const userAccount = await sut.loadByToken(userWithToken.accessToken);

		expect(userAccount).toBeFalsy();
	});
});
