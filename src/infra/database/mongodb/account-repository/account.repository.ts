import { IAddAccountRepository } from '../../../../data/interfaces/db/addAccountRepository.interface';
import { IAccountModel } from '../../../../domain/interfaces/model/accountModel.interfae';
import { IAddAccountModel } from '../../../../domain/interfaces/usecases/addAccount.interface';
import { MongoHelper } from '../helper/mongo.helper';

export default class AccountMongoRepository implements IAddAccountRepository {
	async add(accountInfo: IAddAccountModel): Promise<IAccountModel> {
		const accountCollection = await MongoHelper.getCollection('accounts');

		await accountCollection.insertOne(accountInfo);
		return MongoHelper.mapper(accountInfo);
	}
}
