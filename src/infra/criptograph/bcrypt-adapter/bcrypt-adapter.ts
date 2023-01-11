import bcrypt from 'bcrypt';

import { IHashCompare } from '../../../data/interfaces/criptography/hash/hashComparer.interface';
import { IHasher } from '../../../data/interfaces/criptography/hash/hasher.interface';

export default class BcryptAdapter implements IHasher, IHashCompare {
	constructor(private readonly salt: number) {}

	async hash(value: string): Promise<string> {
		const hashedValue = await bcrypt.hash(value, this.salt);

		return hashedValue;
	}

	async compare(value: string, hash: string): Promise<boolean> {
		const hashedValue = await bcrypt.compare(value, hash);

		return hashedValue;
	}
}
