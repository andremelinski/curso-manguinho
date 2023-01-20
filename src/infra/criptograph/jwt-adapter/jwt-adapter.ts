import * as jwt from 'jsonwebtoken';

import { IDecrypter } from '../../../data/interfaces/criptography/token/encrypterComparer.interface';
import { IEncrypter } from '../../../data/interfaces/criptography/token/encrypterGenerator.interface';

export default class JwtAdapter implements IEncrypter, IDecrypter {
	constructor(private readonly secretKey: string) {}

	encrypt(value: string): string {
		return jwt.sign({ id: value }, this.secretKey);
	}

	decrypt(value: string): string {
		const decryptToken: any = jwt.verify(value, this.secretKey);

		return decryptToken;
	}
}