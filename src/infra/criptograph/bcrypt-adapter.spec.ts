import bcrypt from 'bcrypt';

import { IHasher } from '../../data/interfaces/criptography/hasher.interface';
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
	sut: IHasher;
}
const makeSut = (): SutTypes => {
	const sut = new BcryptAdapter(salt);

	return { sut };
};

describe('Bcrypt Adapter', () => {
	let sut: IHasher;

	beforeEach(() => {
		({ sut } = makeSut());
	});
	test('Should call bcrypt with correct value', async () => {
		const hashSpy = jest.spyOn(bcrypt, 'hash');

		await sut.hash('any_value');
		expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
	});
	test('Should return hash on success', async () => {
		const hashValue = await sut.hash('any_value');

		expect(hashValue).toEqual('hashed_value');
	});

	test('Should throws if bcrypt throws', async () => {
		// eslint-disable-next-line max-nested-callbacks
		jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
			throw new Error();
		});
		const promise = sut.hash('any_value');

		await expect(promise).rejects.toThrow();
	});
});
