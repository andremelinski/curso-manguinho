/* eslint-disable max-classes-per-file */
import DbAddAccount from './db-add-account';
import { IAccountModel, IAddAccountModel, IAddAccountRepository, IHasher } from './db-add-account-protocols';

/* eslint-disable require-await */
const makeHash = (): IHasher => {
	class HashStub implements IHasher {
		async hash(): Promise<string> {
			return new Promise((resolve) => {
				resolve('hashed_password');
			});
		}
	}
	return new HashStub();
};

const makeAddAccountRepository = (): IAddAccountRepository => {
	const fakeAccount = {
		id: 'valid_id',
		name: 'valid_name',
		email: 'valid_email',
		password: 'hashed_password',
	};

	class AddAccountRpositoryStub implements IAddAccountRepository {
		add(account: IAddAccountModel): Promise<IAccountModel> {
			return new Promise((resolve) => {
				resolve(fakeAccount);
			});
		}
	}
	return new AddAccountRpositoryStub();
};

interface SutTypes {
	hasherStub: IHasher;
	sut: DbAddAccount;
	addAccountRepositoryStub: IAddAccountRepository;
}
const makeSut = (): SutTypes => {
	const hasherStub = makeHash();
	const addAccountRepositoryStub = makeAddAccountRepository();

	const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub);

	return {
		hasherStub,
		sut,
		addAccountRepositoryStub,
	};
};

describe('DbAddAccount UseCase', () => {
	let hasherStub: IHasher;
	let sut: DbAddAccount;
	let addAccountRepositoryStub: IAddAccountRepository;

	beforeEach(() => {
		({ sut, hasherStub, addAccountRepositoryStub } = makeSut());
	});
	test('should call Encrypted with correct password', async () => {
		const encryptSpy = jest.spyOn(hasherStub, 'hash');

		const accountData = {
			name: 'valid_name',
			email: 'valid_email',
			password: 'valid_password',
		};

		await sut.add(accountData);
		expect(encryptSpy).toHaveBeenCalledWith(accountData.password);
	});
	// teste que evita a adicao de um try catch no Encrypter e errosera tratado na camada se signUp como erro 500
	test('should throw Error when Encrypter throws', async () => {
		jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(
			new Promise((resolve, reject) => {
				return reject(new Error());
			})
		);

		const accountData = {
			name: 'valid_name',
			email: 'valid_email',
			password: 'valid_password',
		};

		const promiseAddccountDb = sut.add(accountData);

		await expect(promiseAddccountDb).rejects.toThrow();
	});

	test('should call DbAddAccount with correct information', async () => {
		const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
		const accountData = {
			name: 'valid_name',
			email: 'valid_email',
			password: 'valid_password',
		};

		await sut.add(accountData);

		expect(addSpy).toHaveBeenCalledWith({
			name: 'valid_name',
			email: 'valid_email',
			password: 'hashed_password',
		});
	});
	test('should call return an account on success', async () => {
		const accountData = {
			name: 'valid_name',
			email: 'valid_email',
			password: 'valid_password',
		};

		const account = await sut.add(accountData);

		expect(account).toEqual({
			id: 'valid_id',
			name: 'valid_name',
			email: 'valid_email',
			password: 'hashed_password',
		});
	});

	test('should throw Error when AddAcountRepository throws', async () => {
		jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(
			new Promise((resolve, reject) => {
				return reject(new Error());
			})
		);

		const accountData = {
			name: 'valid_name',
			email: 'valid_email',
			password: 'valid_password',
		};

		const promiseAddccountDb = sut.add(accountData);

		await expect(promiseAddccountDb).rejects.toThrow();
	});
});
