import bcrypt from 'bcrypt';

import { IEncrypter } from '../../../src/data/interfaces/encrypter.interface';
import BcryptAdapter from './bcrypt-adapter';

const salt = 12;

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
	test('Shouuld call bcrypt with correct value', async () => {
		const hashSpy = jest.spyOn(bcrypt, 'hash');

		await sut.encrypt('any_value');
		expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
	});
});
