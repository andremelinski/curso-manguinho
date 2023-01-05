/* eslint-disable max-classes-per-file */
import { IAccountModel } from '../add-account/db-add-account-protocols';
import { DbAuthentication } from './db-authentication';
import {
	IEncrypter,
	IHashCompare,
	ILoadAccountByEmailRepository,
	IUpdateAccessTokenRepository,
} from './db-authentication-protocols';


const accountData = {
	email: 'valid_email@email.com',
	password: 'valid_password'
};
const fakeAccount: IAccountModel = {
	id: 'valid_id',
	name: 'valid_name',
	email: 'valid_email',
	password: 'hashed_password',
};

const makeHashComparer = (): IHashCompare => {
	class HashComparerStub implements IHashCompare {
		compare(userPassword: string, hashedPassword: string): Promise<boolean> {
			return new Promise(resolve => {
				return resolve(true);
			});
		}
	}
	return new HashComparerStub();
};
const makeLoadAccountByEmailRepository = (): ILoadAccountByEmailRepository => {
	class LoadAccountByEmailRepositoryStub implements ILoadAccountByEmailRepository {
		load(email: string): Promise<IAccountModel> {
			return new Promise((resolve) => {
				return resolve(fakeAccount);
			});
		}
	}
	return new LoadAccountByEmailRepositoryStub();
};

const makeUpdateAccessTokenRepository = (): IUpdateAccessTokenRepository => {
	class UpdateAccessTokenRepositoryStub implements IUpdateAccessTokenRepository {
		updateAccessToken(userId: string, token: string): Promise<void> {
			return new Promise((resolve) => {
				return resolve();
			});
		}
	}
	return new UpdateAccessTokenRepositoryStub();
};

const makeEncrypter = (): IEncrypter => {
	class EncrypterStub implements IEncrypter {
		encrypt(value: string): string {
			return 'token';
		}
	}
	return new EncrypterStub();
};

interface SutTypes {
	sut: DbAuthentication;
	loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository;
	updateAccessTokenRepositoryStub: IUpdateAccessTokenRepository;
	hashComparerStub: IHashCompare;
	encrypterStub: IEncrypter;
}
const makeSut = (): SutTypes => {
	const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
	const hashComparerStub = makeHashComparer();
	const encrypterStub = makeEncrypter();
	const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();
	const sut = new DbAuthentication(
		loadAccountByEmailRepositoryStub,
		hashComparerStub,
		encrypterStub,
		updateAccessTokenRepositoryStub
	);

	return {
		sut,
		loadAccountByEmailRepositoryStub,
		hashComparerStub,
		encrypterStub,
		updateAccessTokenRepositoryStub,
	};
};

describe('DbAddAccount UseCase', () => {
	let sut: DbAuthentication;
	let loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository;
	let updateAccessTokenRepositoryStub: IUpdateAccessTokenRepository;
	let hashComparerStub: IHashCompare;
	let encrypterStub: IEncrypter;

	beforeEach(() => {
		({
			sut,
			loadAccountByEmailRepositoryStub,
			hashComparerStub,
			encrypterStub,
			updateAccessTokenRepositoryStub,
		} = makeSut());
	});
	test('should call LoadAccountByEmailRepository with correct email', async () => {
		const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');

		await sut.auth(accountData);
		expect(loadSpy).toHaveBeenCalledWith(accountData.email);
	});
	test('should throw if LoadAccountByEmailRepository throws', async () => {
		// eslint-disable-next-line require-await
		jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(
			new Promise((resolve, reject) => {
				return reject(new Error());
			})
		);

		const promise = sut.auth(accountData);

		await expect(promise).rejects.toThrow();
	});
	test('should return null if user not found', async () => {
		// eslint-disable-next-line require-await
		jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(
			null
		);

		const promise = await sut.auth(accountData);

		expect(promise).toBeNull();
	});

	test('should call hashComparer with correct values', async () => {
		const comprarerSpyOn = jest.spyOn(hashComparerStub, 'compare');

		await sut.auth(accountData);

		expect(comprarerSpyOn).toHaveBeenCalledWith(accountData.password, fakeAccount.password);
	});

	test('should throw if hashComparer throws', async () => {
		// eslint-disable-next-line require-await
		jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
			new Promise((resolve, reject) => {
				return reject(new Error());
			})
		);

		const promise = sut.auth(accountData);

		await expect(promise).rejects.toThrow();
	});
	test('should return null if password and hashed_password does not match', async () => {
		// eslint-disable-next-line require-await
		jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(null);

		const promise = await sut.auth(accountData);

		expect(promise).toBeNull();
	});
	test('should call encrypter if hashed and password match', async () => {
		const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt');

		await sut.auth(accountData);

		expect(encrypterSpy).toHaveBeenCalledWith(fakeAccount.id);
	});

	test('should throw if encrypter throws', async () => {
		// eslint-disable-next-line require-await
		jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => {
			throw new Error();
		});

		const promise = sut.auth(accountData);

		await expect(promise).rejects.toThrow();
	});

	test('should return an access token from encrypter', async () => {
		const promise = await sut.auth(accountData);

		expect(promise).toEqual('token');
	});
	test('should call UpdateAccessTokenRepository with corect values', async () => {
		const updateAccessTokenRepoSpy = jest.spyOn(
			updateAccessTokenRepositoryStub,
			'updateAccessToken'
		);

		await sut.auth(accountData);

		expect(updateAccessTokenRepoSpy).toHaveBeenLastCalledWith(fakeAccount.id, 'token');
	});
	test('should throw if UpdateAccessTokenRepository throws', async () => {
		// eslint-disable-next-line require-await
		jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockReturnValueOnce(
			new Promise((resolve, reject) => {
				return reject(new Error());
			})
		);

		const promise = sut.auth(accountData);

		await expect(promise).rejects.toThrow();
	});
});