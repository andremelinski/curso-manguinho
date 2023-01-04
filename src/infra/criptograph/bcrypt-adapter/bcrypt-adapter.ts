import bcrypt from 'bcrypt';

import { IHashCompare } from '../../../data/interfaces/criptography/hashComparer.interface';
import { IHasher } from '../../../data/interfaces/criptography/hasher.interface';

export default class BcryptAdapter implements IHasher, IHashCompare {
	private readonly salt: number;

	constructor(salt: number) {
		this.salt = salt;
	}

	async hash(value: string): Promise<string> {
		const hashedValue = await bcrypt.hash(value, this.salt);

		return hashedValue;
	}

	async compare(value: string, hash: string): Promise<boolean> {
		const hashedValue = await bcrypt.compare(value, hash);

		return hashedValue;
	}
}
