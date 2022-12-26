/* eslint-disable function-paren-newline */
import { IAccountModel, IAddAccount, IAddAccountModel, IAddAccountRepository, IEncrypter } from './db-add-account-protocols';

export default class DbAddAccount implements IAddAccount {
	private readonly encrypter: IEncrypter;

	private readonly addAccountRpository: IAddAccountRepository;

	constructor(encrypter: IEncrypter, addAccountRpository: IAddAccountRepository) {
		this.encrypter = encrypter;
		this.addAccountRpository = addAccountRpository;
	}

	// eslint-disable-next-line require-await
	async add(accountData: IAddAccountModel): Promise<IAccountModel> {
		const hashedPassword = await this.encrypter.encrypt(accountData.password);

		const newAccount = await this.addAccountRpository.add({
			...accountData,
			password: hashedPassword,
		});

		return new Promise((resolve) => {
			return resolve(newAccount);
		});
	}
}
