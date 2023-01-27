import { IDecrypter } from '../../../interfaces/criptography/token/encrypterComparer.interface';
import { IAccountModel, ILoadAccountByIdRepository, ILoadAccountByToken } from './db-load-account-by-token-protocols';


export default class DbLoadAccountByToken implements ILoadAccountByToken {
	constructor(
		private readonly decrypter: IDecrypter,
		private readonly loadAccountRepository: ILoadAccountByIdRepository,
	) {}

	async load(accessToken: string, role?: string): Promise<IAccountModel> | null {
		const token = this.decrypter.decrypt(accessToken);

		if (token) {
			const userAccount = await this.loadAccountRepository.loadById(token, role);

			if (userAccount) {
				return userAccount;
			}
		}
		return null;
	}
}
