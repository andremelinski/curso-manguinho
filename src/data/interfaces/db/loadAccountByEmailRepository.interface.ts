import { IAccountModel } from '../../../domain/interfaces/model/accountModel.interfae';

export interface ILoadAccountByEmailRepository {
	loadByEmail(email: string): Promise<IAccountModel>;
}
