import { AccessDeniedError } from '../../errors';
import { forbidden, ok, serverError } from '../../helper/http-helper';
import { HttpReponse, HttpRequest, ILoadAccountByToken, IMiddleware } from './auth-midleware.protocols';

export class AuthMiddleware implements IMiddleware {
	constructor(private readonly loadAccountByToken: ILoadAccountByToken, private readonly role?: string) {}

	async handle(httpRequest: HttpRequest): Promise<HttpReponse> {
		try {
			const accessToken = httpRequest.headers?.[ 'x-access-token' ];

			if (accessToken) {
				const account = await this.loadAccountByToken.load(accessToken, this.role);

				if (account) {
					return ok({ accountId: account.id });
				}
			}
			return forbidden(new AccessDeniedError());
		} catch (error) {
			return serverError(error);
		}
	}
}