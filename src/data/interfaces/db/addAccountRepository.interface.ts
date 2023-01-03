import { IAccountModel } from '../../../domain/interfaces/model/accountModel.interfae';
import { IAddAccountModel } from '../../../domain/interfaces/usecases/addAccount.interface';

export interface IAddAccountRepository {
	add(account: IAddAccountModel): Promise<IAccountModel>;
}
