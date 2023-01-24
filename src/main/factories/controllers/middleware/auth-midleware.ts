import { AuthMiddleware } from '../../../../presentation/controllers/middleware/auth-midleware.controller';
import { IMiddleware } from '../../../../presentation/http/middleware.interface';
import { makeDbAccountByToken } from '../../usecases/load-account-by-token/db-account-by-token.factory';


export const makeAuthMiddleware = (role?: string): IMiddleware => {
	return new AuthMiddleware(makeDbAccountByToken(), role);
};
