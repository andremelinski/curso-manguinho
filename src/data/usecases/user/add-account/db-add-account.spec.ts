/* eslint-disable max-classes-per-file */
import DbAddAccount from './db-add-account';
import {
	IAccountModel,
	IAddAccountDto,
	IAddAccountRepository,
	IHasher,
	ILoadAccountByEmailRepository,
} from './db-add-account-protocols';

const accountData: IAddAccountDto = {
	name: 'valid_name',
	email: 'valid_email@email.com',
	password: 'valid_password',
};
const fakeAccount: IAccountModel = {
	id: 'valid_id',
	name: 'valid_name',
	email: 'valid_email@email.com',
	password: 'hashed_password',
};
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

const makeLoadAccountByEmailRepository = (): ILoadAccountByEmailRepository => {
	class LoadAccountByEmailRepositoryStub implements ILoadAccountByEmailRepository {
		loadByEmail(email: string): Promise<IAccountModel> {
			return new Promise((resolve) => {
				return resolve(null);
			});
		}
	}
	return new LoadAccountByEmailRepositoryStub();
};

const makeAddAccountRepository = (): IAddAccountRepository => {
	class AddAccountRpositoryStub implements IAddAccountRepository {
		add(account: IAddAccountDto): Promise<IAccountModel> {
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
	loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository;
}
const makeSut = (): SutTypes => {
	const hasherStub = makeHash();
	const addAccountRepositoryStub = makeAddAccountRepository();
	const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
	const sut = new DbAddAccount(
		hasherStub,
		addAccountRepositoryStub,
		loadAccountByEmailRepositoryStub
	);

	return {
		hasherStub,
		sut,
		addAccountRepositoryStub,
		loadAccountByEmailRepositoryStub,
	};
};

describe('DbAddAccount UseCase', () => {
	let hasherStub: IHasher;
	let sut: DbAddAccount;
	let addAccountRepositoryStub: IAddAccountRepository;
	let loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository;

	beforeEach(() => {
		({ sut, hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub }
			= makeSut());
	});
	test('should call Encrypted with correct password', async () => {
		const encryptSpy = jest.spyOn(hasherStub, 'hash');

		await sut.add(accountData);
		expect(encryptSpy).toHaveBeenCalledWith('valid_password');
	});
	// teste que evita a adicao de um try catch no Encrypter e errosera tratado na camada se signUp como erro 500
	test('should throw Error when Encrypter throws', async () => {
		jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(
			new Promise((resolve, reject) => {
				return reject(new Error());
			})
		);

		const promiseAddccountDb = sut.add(accountData);

		await expect(promiseAddccountDb).rejects.toThrow();
	});

	test('should call DbAddAccount with correct information', async () => {
		const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');

		await sut.add(accountData);

		expect(addSpy).toHaveBeenCalledWith({
			name: 'valid_name',
			email: 'valid_email@email.com',
			password: 'hashed_password',
		});
	});
	test('should return null LoadAccountByEmailRepository found an user', async () => {
		jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(
			new Promise((resolve) => {
				return resolve(fakeAccount);
			})
		);

		const user = await sut.add(accountData);

		expect(user).toBeNull();
	});
	test('should call return an account on success', async () => {
		const account = await sut.add(accountData);

		expect(account).toEqual({
			id: 'valid_id',
			name: 'valid_name',
			email: 'valid_email@email.com',
			password: 'hashed_password',
		});
	});

	test('should throw Error when AddAcountRepository throws', async () => {
		jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(
			new Promise((resolve, reject) => {
				return reject(new Error());
			})
		);

		const promiseAddccountDb = sut.add(accountData);

		await expect(promiseAddccountDb).rejects.toThrow();
	});
	test('should call LoadAccountByEmailRepository with correct email', async () => {
		const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');

		await sut.add(accountData);
		expect(loadSpy).toHaveBeenCalledWith('valid_email@email.com');
	});
	test('should throw if LoadAccountByEmailRepository throws', async () => {
		// eslint-disable-next-line require-await
		jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(
			new Promise((resolve, reject) => {
				return reject(new Error());
			})
		);

		const promise = sut.add(accountData);

		await expect(promise).rejects.toThrow();
	});
});
