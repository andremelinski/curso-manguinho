import { IAuthentication, IAuthenticationDto } from '../../../domain/interfaces/usecases/authentication.interface';
import { IAuthenticator } from './authenticator.interface';

export default class AuthenticationValidation implements IAuthenticator {
	private readonly authentication: IAuthentication;

	constructor(authentication: IAuthentication) {
		this.authentication = authentication;
	}

	async validate(userInfoToValidate: IAuthenticationDto): Promise<string> {
		const authUser = await this.authentication.auth(userInfoToValidate);

		return authUser;
	}
}
