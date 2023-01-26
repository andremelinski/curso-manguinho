import { IAccountModel } from '../model/accountModel.interfae';

export type IAddAccountDto = Omit<IAccountModel, 'id'>
export interface IAddAccount {
	add(account: IAddAccountDto): Promise<IAccountModel>;
}
