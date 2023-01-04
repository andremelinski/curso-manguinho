/* eslint-disable require-await */
/* eslint-disable max-nested-callbacks */
import bcrypt from 'bcrypt';

import BcryptAdapter from './bcrypt-adapter';

const salt = 12;

jest.mock('bcrypt', () => {
	return {
		async hash(): Promise<string> {
			return new Promise((resolve) => {
				return resolve('hashed_value');
			});
		},

		async compare(): Promise<boolean> {
			return new Promise((resolve) => {
				return resolve(true);
			});
		},
	};
});

const makeSut = (): BcryptAdapter => {
	return new BcryptAdapter(salt);
};

describe('Bcrypt Adapter', () => {
	let sut: BcryptAdapter;

	beforeEach(() => {
		sut = makeSut();
	});
	test('Should call bcrypt.hash with correct value', async () => {
		const hashSpy = jest.spyOn(bcrypt, 'hash');

		await sut.hash('any_value');
		expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
	});
	test('Should return hash with success of bcrypt.hash', async () => {
		const hashValue = await sut.hash('any_value');

		expect(hashValue).toEqual('hashed_value');
	});

	test('Should throws if bcrypt.hash throws', async () => {
		jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
			throw new Error();
		});
		const promise = sut.hash('any_value');

		await expect(promise).rejects.toThrow();
	});

	test('Should call bcrypt.hash with correct value', async () => {
		const compareSpy = jest.spyOn(bcrypt, 'compare');

		await sut.compare('value', 'hashed_value');
		expect(compareSpy).toHaveBeenCalledWith('value', 'hashed_value');
	});
	test('Should return true when compare match', async () => {
		const hashValue = await sut.compare('value', 'hashed_value');

		expect(hashValue).toEqual(true);
	});
	test('Should return true when compare match', async () => {
		jest.spyOn(bcrypt, 'compare').mockImplementation(() => {
			return Promise.resolve(false);
		});
		const hashValue = await sut.compare('value', 'hashed_value');

		expect(hashValue).toEqual(false);
	});
	test('Should throws if bcrypt.compare throws', async () => {
		// eslint-disable-next-line max-nested-callbacks
		jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
			throw new Error();
		});
		const promise = sut.compare('value', 'hashed_value');

		await expect(promise).rejects.toThrow();
	});
});
