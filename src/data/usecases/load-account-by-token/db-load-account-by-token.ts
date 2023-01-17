import { ILoadAccountByToken } from '../../../domain/interfaces/usecases/middleware/load-by-token.interface';
import { IDecrypter } from '../../interfaces/criptography/token/encrypterComparer.interface';
import { ILoadAccountByTokenRepository } from '../../interfaces/db/loadAccountByTokenRepository.interface';
import { IAccountModel } from './db-load-account-by-token-protocols';

export default class DbLoadAccountByToken implements ILoadAccountByToken {
	constructor(
		private readonly decrypter: IDecrypter,
		private readonly loadAccountRepository: ILoadAccountByTokenRepository,
	) {}

	async load(accessToken: string, role?: string): Promise<IAccountModel> | null {
		const token = await this.decrypter.decrypt(accessToken);

		if (token) {
			const userAccount = await this.loadAccountRepository.loadByToken(token, role);

			if (userAccount) {
				return userAccount;
			}
		}
		return null;
	}
}
