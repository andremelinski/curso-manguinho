import { ObjectId } from 'mongodb';

import { IAddAccountRepository } from '../../../../data/interfaces/db/addAccountRepository.interface';
import { ILoadAccountByEmailRepository } from '../../../../data/interfaces/db/loadAccountByEmailRepository.interface';
import { ILoadAccountByTokenRepository } from '../../../../data/interfaces/db/loadAccountByTokenRepository.interface';
import { IUpdateAccessTokenRepository } from '../../../../data/interfaces/db/updateAccessTokenRepository.interface';
import { IAccountModel } from '../../../../domain/interfaces/model/accountModel.interfae';
import { IAddAccountDto } from '../../../../domain/interfaces/usecases/addAccount.interface';
import { MongoHelper } from '../helper/mongo.helper';

export default class AccountMongoRepository
implements
		IAddAccountRepository,
		ILoadAccountByEmailRepository,
		IUpdateAccessTokenRepository,
		ILoadAccountByTokenRepository {
	async add(accountInfo: IAddAccountDto): Promise<IAccountModel> {
		const accountCollection = await MongoHelper.getCollection('accounts');

		await accountCollection.insertOne(accountInfo);
		return MongoHelper.mapper(accountInfo);
	}

	async loadByEmail(email: string): Promise<IAccountModel> {
		const accountCollection = await MongoHelper.getCollection('accounts');

		const account = await accountCollection.findOne({ email });

		return account && MongoHelper.mapper(account);
	}

	async updateAccessToken(userId: string, accessToken: string): Promise<void> {
		const accountCollection = await MongoHelper.getCollection('accounts');

		await accountCollection.findOneAndUpdate(
			{ _id: new ObjectId(userId) },
			{ $set: { accessToken } }
		);
	}

	async loadById(userId: string, role?: string): Promise<IAccountModel> {
		const accountCollection = await MongoHelper.getCollection('accounts');

		const account = await accountCollection.findOne({ _id: new ObjectId(userId), role });

		return account && MongoHelper.mapper(account);
	}
}
