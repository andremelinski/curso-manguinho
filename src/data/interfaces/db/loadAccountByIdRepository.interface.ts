import { IAccountModel } from '../../../domain/interfaces/model/accountModel.interfae';

export interface ILoadAccountByIdRepository {
	loadById(token: string, role?: string): Promise<IAccountModel>;
}
