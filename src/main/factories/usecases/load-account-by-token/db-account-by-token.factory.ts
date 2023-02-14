import DbLoadAccountByToken from '../../../../data/usecases/user/load-account-by-token/db-load-account-by-token';
import { ILoadAccountByToken } from '../../../../domain/interfaces/usecases/middleware/load-by-token.interface';
import JwtAdapter from '../../../../infra/criptograph/jwt-adapter/jwt-adapter';
import AccountMongoRepository from '../../../../infra/database/mongodb/account-repository/account.repository';
import env from '../../../config/env';

export const makeDbAccountByToken = (): ILoadAccountByToken => {
	const secretSecretKey = env.JWT_SECRET_KEY;
	const jwtAdapter = new JwtAdapter(secretSecretKey);
	const accountMongoRepository = new AccountMongoRepository();

	return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository);
};
