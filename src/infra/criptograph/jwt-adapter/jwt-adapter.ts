import * as jwt from 'jsonwebtoken';

import { IEncrypter } from '../../../data/interfaces/criptography/token/encrypterGenerator.interface';

export default class JwtAdapter implements IEncrypter {
	constructor(private readonly secretKey: string) {}

	encrypt(value: string): string {
		return jwt.sign({ id: value }, this.secretKey);
	}

	// decrpyt(value: string): string {
	// 	return jwt.verify(value, this.secretKey);
	// }
}