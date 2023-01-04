import * as jwt from 'jsonwebtoken';

import { IEncryptCompare } from '../../../data/interfaces/criptography/token/encrypterComparer.interface';
import { IEncrypter } from '../../../data/interfaces/criptography/token/encrypterGenerator.interface';

export default class JwtAdapter implements IEncrypter, IEncryptCompare {
	private readonly secretKey: string;

	constructor(secretKey: string) {
		this.secretKey = secretKey;
	}

	encrypt(value: string): string {
		return jwt.sign({ id: value }, this.secretKey);
	}

	compare(value: string): boolean {
		const isValid = jwt.verify(value, this.secretKey);

		if (!isValid) {
			return false;
		}
		return true;
	}
}