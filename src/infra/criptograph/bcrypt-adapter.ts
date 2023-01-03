import bcrypt from 'bcrypt';

import { IHasher } from '../../data/interfaces/criptography/hasher.interface';


export default class BcryptAdapter implements IHasher {
	private readonly salt: number;

	constructor(salt: number) {
		this.salt = salt;
	}

	async hash(value: string): Promise<string> {
		const hashedValue = await bcrypt.hash(value, this.salt);

		return hashedValue;
	}
}
