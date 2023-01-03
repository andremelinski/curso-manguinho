/* eslint-disable function-paren-newline */
import { IAccountModel, IAddAccount, IAddAccountModel, IAddAccountRepository, IHasher } from './db-add-account-protocols';

export default class DbAddAccount implements IAddAccount {
	private readonly hasher: IHasher;

	private readonly addAccountRpository: IAddAccountRepository;

	constructor(hasher: IHasher, addAccountRpository: IAddAccountRepository) {
		this.hasher = hasher;
		this.addAccountRpository = addAccountRpository;
	}

	async add(accountData: IAddAccountModel): Promise<IAccountModel> {
		const hashedPassword = await this.hasher.hash(accountData.password);

		const newAccount = await this.addAccountRpository.add({
			...accountData,
			password: hashedPassword,
		});

		return newAccount;
	}
}
