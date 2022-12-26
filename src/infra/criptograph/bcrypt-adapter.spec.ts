import bcrypt from 'bcrypt';

import { IEncrypter } from '../../../src/data/interfaces/encrypter.interface';
import BcryptAdapter from './bcrypt-adapter';

const salt = 12;

jest.mock('bcrypt', () => {
	return {
		// eslint-disable-next-line require-await
		async hash(): Promise<string> {
			return new Promise((resolve) => {
				return resolve('hashed_value');
			});
		},
	};
});

interface SutTypes {
	sut: IEncrypter;
}
const makeSut = (): SutTypes => {
	const sut = new BcryptAdapter(salt);

	return { sut };
};

describe('Bcrypt Adapter', () => {
	let sut: IEncrypter;

	beforeEach(() => {
		({ sut } = makeSut());
	});
	test('Should call bcrypt with correct value', async () => {
		const hashSpy = jest.spyOn(bcrypt, 'hash');

		await sut.encrypt('any_value');
		expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
	});
	test('Should return hash on success', async () => {
		const encryptValue = await sut.encrypt('any_value');

		expect(encryptValue).toEqual('hashed_value');
	});

	test('Should throws if bcrypt throws', async () => {
		// eslint-disable-next-line max-nested-callbacks
		jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
			throw new Error();
		});
		const promise = sut.encrypt('any_value');

		await expect(promise).rejects.toThrow();
	});
});
