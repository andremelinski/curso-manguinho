import {
	IAuthentication,
	IAuthenticationDto,
	IEncrypter,
	IHashCompare,
	ILoadAccountByEmailRepository,
	IUpdateAccessTokenRepository,
} from './db-authentication-protocols';

export class DbAuthentication implements IAuthentication {
	constructor(
		private readonly getUserByEmailRepository: ILoadAccountByEmailRepository,
		private readonly hashComparer: IHashCompare,
		private readonly encrypter: IEncrypter,
		private readonly updateAccessTokenRepository: IUpdateAccessTokenRepository
	) {	}

	async auth({ email, password }: IAuthenticationDto): Promise<string> {
		const user = await this.getUserByEmailRepository.loadByEmail(email);

		if (user) {
			const validPassword = await this.hashComparer.compare(password, user.password);

			if (validPassword) {
				const accessToken = this.encrypter.encrypt(user.id);

				await this.updateAccessTokenRepository.updateAccessToken(user.id, accessToken);
				return accessToken;
			}
		}
		return null;
	}
}