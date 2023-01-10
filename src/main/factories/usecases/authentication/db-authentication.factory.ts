import { DbAuthentication } from '../../../../data/usecases/authentication/db-authentication';
import BcryptAdapter from '../../../../infra/criptograph/bcrypt-adapter/bcrypt-adapter';
import JwtAdapter from '../../../../infra/criptograph/jwt-adapter/jwt-adapter';
import AccountMongoRepository from '../../../../infra/database/mongodb/account-repository/account.repository';
import env from '../../../config/env';

export const makeDbAuthentication = (): DbAuthentication => {
	const accountMongoRepository = new AccountMongoRepository();
	const bcryptAdapter = new BcryptAdapter(parseInt(env.SALT));
	const jwtAdapter = new JwtAdapter(env.JWT_SECRET_KEY);

	return new DbAuthentication(
		accountMongoRepository,
		bcryptAdapter,
		jwtAdapter,
		accountMongoRepository
	);
};
