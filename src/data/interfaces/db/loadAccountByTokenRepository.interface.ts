import { IAccountModel } from '../../../domain/interfaces/model/accountModel.interfae';

export interface ILoadAccountByTokenRepository {
	loadByToken(token: string, role?: string): Promise<IAccountModel>;
}
