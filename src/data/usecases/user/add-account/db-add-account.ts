import {
	IAccountModel,
	IAddAccount,
	IAddAccountDto,
	IAddAccountRepository,
	IHasher,
	ILoadAccountByEmailRepository,
} from './db-add-account-protocols';

/* eslint-disable max-classes-per-file */
/* eslint-disable function-paren-newline */
export default class DbAddAccount implements IAddAccount {
	constructor(
		private readonly hasher: IHasher,
		private readonly addAccountRpository: IAddAccountRepository,
		private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository
	) {}

	async add(accountData: IAddAccountDto): Promise<IAccountModel> {
		const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email);

		if (account) {
			return null;
		}

		const hashedPassword = await this.hasher.hash(accountData.password);
		const newAccount = await this.addAccountRpository.add({
			...accountData,
			password: hashedPassword,
		});

		return newAccount;
	}
}
