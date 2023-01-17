import { IAccountModel } from '../../model/accountModel.interfae';

export interface ILoadAccountByToken {
	// when not passed, should load a user
	load(accessToken: string, role?: string): Promise<IAccountModel> | null;
}
