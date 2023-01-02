import { IAuthentication } from '../../../domain/interfaces/usecases/authentication.interface';
import { IAuthenticator } from './authenticator.interface';

export default class CompareFieldValidation implements IAuthenticator {
	private readonly authentication: IAuthentication;

	private readonly authParam1: string;

	private readonly authParam2: string;

	constructor(authParam1: string, authParam2: string, authentication: IAuthentication) {
		this.authParam1 = authParam1,
		this.authParam2 = authParam2,
		this.authentication = authentication;
	}

	async validate(object: any): Promise <string> {
		const authUser = await this.authentication.auth(
			object[this.authParam1],
			object[this.authParam2]
		);

		return authUser;
	}
}
