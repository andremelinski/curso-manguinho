import bcrypt from 'bcrypt';

import { IEncrypter } from '../../../src/data/interfaces/encrypter.interface';

export default class BcryptAdapter implements IEncrypter {
	private readonly salt: number;

	constructor(salt: number) {
		this.salt = salt;
	}

	async encrypt(value: string): Promise<string> {
		const hashedValue = await bcrypt.hash(value, this.salt);

		return hashedValue;
	}
}
