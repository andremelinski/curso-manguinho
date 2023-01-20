/* eslint-disable max-nested-callbacks */
/* eslint-disable max-classes-per-file */
import { IDecrypter } from '../../interfaces/criptography/token/encrypterComparer.interface';
import { ILoadAccountByTokenRepository } from '../../interfaces/db/loadAccountByTokenRepository.interface';
import DbLoadAccountByToken from './db-load-account-by-token';
import { IAccountModel } from './db-load-account-by-token-protocols';


const accessToken = 'any-token';
const role = 'any_role';
const fakeAccount = {
	id: 'valid_id',
	name: 'valid_name',
	email: 'valid_email@email.com',
	password: 'hashed_password',
};

const makeLoadAccountByTokenRepository = (): ILoadAccountByTokenRepository => {
	return new (class LoadAccountByTokenRepositoryStub implements ILoadAccountByTokenRepository {
		loadByToken(token: string, role?: string): Promise<IAccountModel> {
			return new Promise((resolve) => {
				return resolve(fakeAccount);
			});
		}
	})();
};

const makeDecrypter = (): IDecrypter => {
	return new (class DecrypterStub implements IDecrypter {
		// eslint-disable-next-line require-await
		decrypt(): string {
			return 'token_decrypted';
		}
	})();
};

interface SutTypes {
	sut: DbLoadAccountByToken;
	loadAccountByTokenStub: ILoadAccountByTokenRepository;
	decrypterStub: IDecrypter;
}

const makeSut = (): SutTypes => {
	const loadAccountByTokenStub = makeLoadAccountByTokenRepository();
	const decrypterStub = makeDecrypter();
	const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenStub);

	return { sut, loadAccountByTokenStub, decrypterStub };
};

describe('DbLoadAccountByToken Usecase', () => {
	let sut: DbLoadAccountByToken;
	let loadAccountByTokenStub: ILoadAccountByTokenRepository;
	let decrypterStub: IDecrypter;

	beforeEach(() => {
		({ sut, loadAccountByTokenStub, decrypterStub } = makeSut());
	});

	test('Should call Decrypter with correct values', async () => {
		const decrypterStubSpy = jest.spyOn(decrypterStub, 'decrypt');

		await sut.load(accessToken);

		expect(decrypterStubSpy).toHaveBeenCalledWith(accessToken);
	});
	test('Should return null if Decrypter fail to decrpyt', async () => {
		jest.spyOn(decrypterStub, 'decrypt').mockReturnValue(null);

		const account = await sut.load(accessToken);
		const accountWithRole = await sut.load(accessToken, role);

		expect(account).toBeNull();
		expect(accountWithRole).toBeNull();
	});
	test('Should call loadAccountByToken when token exists', async () => {
		const loadAccountByTokenStubSpy = jest.spyOn(loadAccountByTokenStub, 'loadByToken');

		await sut.load(accessToken, role);

		expect(loadAccountByTokenStubSpy).toHaveBeenCalledWith('token_decrypted', 'any_role');

		await sut.load(accessToken);

		expect(loadAccountByTokenStubSpy).toHaveBeenCalledWith(
			'token_decrypted', undefined
		);
	});
	test('Should return null if loadAccountByToken return null', async () => {
		jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockResolvedValue(Promise.resolve(null));

		const account = await sut.load(accessToken);

		expect(account).toBeNull();

		const accountWithRole = await sut.load(accessToken, role);

		expect(accountWithRole).toBeNull();
	});

	test('Should return an account on suceess', async () => {
		const account = await sut.load(accessToken);

		expect(account).toEqual(fakeAccount);

		const accountWithRole = await sut.load(accessToken, role);

		expect(accountWithRole).toEqual(fakeAccount);
	});
	test('should throw Error if Decrypter throws', async () => {
		jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(() => {
			throw new Error();
		});

		const promiseDb = sut.load(accessToken, role);

		await expect(promiseDb).rejects.toThrow();
	});
});