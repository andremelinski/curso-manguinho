import { IAccountModel } from '../../../domain/interfaces/model/accountModel.interfae';

export interface ILoadAccountByEmailRepository {
	loadAccountByEmail(email: string): Promise<IAccountModel>;
}
