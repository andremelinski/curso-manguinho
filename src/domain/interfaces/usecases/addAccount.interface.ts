import { IAccountModel } from '../model/accountModel.interfae';

export interface IAddAccountModel {
	name: string;
	email: string;
	password: string;
}
export interface IAddAccount {
	add(account: IAddAccountModel): Promise<IAccountModel>;
}
