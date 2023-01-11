import {
	IAuthentication,
	IAuthenticationDto,
	IEncrypter,
	IHashCompare,
	ILoadAccountByEmailRepository,
	IUpdateAccessTokenRepository,
} from './db-authentication-protocols';

export class DbAuthentication implements IAuthentication {
	private readonly getUserByEmailRepository: ILoadAccountByEmailRepository;

	private readonly hashComparer: IHashCompare;

	private readonly encrypter: IEncrypter;

	private readonly updateAccessTokenRepository: IUpdateAccessTokenRepository;

	constructor(
		getUserByEmailRepository: ILoadAccountByEmailRepository,
		hashComparer: IHashCompare,
		encrypter: IEncrypter,
		updateAccessTokenRepository: IUpdateAccessTokenRepository
	) {
		this.getUserByEmailRepository = getUserByEmailRepository;
		this.hashComparer = hashComparer;
		this.encrypter = encrypter;
		this.updateAccessTokenRepository = updateAccessTokenRepository;
	}

	async auth({ email, password }: IAuthenticationDto): Promise<string> {
		const user = await this.getUserByEmailRepository.loadByEmail(email);

		if (!user?.id) {
			return null;
		}

		const validPassword = await this.hashComparer.compare(password, user.password);

		if (!validPassword) {
			return null;
		}
		const accessToken = this.encrypter.encrypt(user.id);

		await this.updateAccessTokenRepository.updateAccessToken(user.id, accessToken);

		return accessToken;
	}
}