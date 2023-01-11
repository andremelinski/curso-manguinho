import { IAccountModel } from '../../../domain/interfaces/model/accountModel.interfae';
import { IAddAccountDto } from '../../../domain/interfaces/usecases/addAccount.interface';

export interface IAddAccountRepository {
	add(account: IAddAccountDto): Promise<IAccountModel>;
}
