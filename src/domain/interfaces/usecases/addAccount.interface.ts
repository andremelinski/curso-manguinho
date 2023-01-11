import { IAccountModel } from '../model/accountModel.interfae';

export interface IAddAccountDto {
	name: string;
	email: string;
	password: string;
}
export interface IAddAccount {
	add(account: IAddAccountDto): Promise<IAccountModel>;
}
