import { IAccountModel } from '../../../domain/interfaces/model/accountModel.interfae';

export interface ILoadAccountByEmailRepository {
	load(email: string): Promise<IAccountModel>;
}
