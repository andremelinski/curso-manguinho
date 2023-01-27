import DbAddAccount from '../../../../data/usecases/user/add-account/db-add-account';
import BcryptAdapter from '../../../../infra/criptograph/bcrypt-adapter/bcrypt-adapter';
import AccountMongoRepository from '../../../../infra/database/mongodb/account-repository/account.repository';
import env from '../../../config/env';

export const makeDbAddAccount = (): DbAddAccount => {
	const accountMongoRepository = new AccountMongoRepository();
	const bcryptAdapter = new BcryptAdapter(parseInt(env.SALT));
	const loadAccountByEmailRepository = new AccountMongoRepository();

	return new DbAddAccount(bcryptAdapter, accountMongoRepository, loadAccountByEmailRepository);
};
