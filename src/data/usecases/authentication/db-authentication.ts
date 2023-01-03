import {
	IAuthentication,
	IAuthenticationModel,
	IHashCompare,
	ILoadAccountByEmailRepository,
	ITokenGenerator,
	IUpdateAccessTokenRepository,
} from './db-authentication-protocols';

export class DbAuthentication implements IAuthentication {
	private readonly getUserByEmailRepository: ILoadAccountByEmailRepository;

	private readonly hashComparer: IHashCompare;

	private readonly tokenGenerator: ITokenGenerator;

	private readonly updateAccessTokenRepository: IUpdateAccessTokenRepository;

	constructor(
		getUserByEmailRepository: ILoadAccountByEmailRepository,
		hashComparer: IHashCompare,
		tokenGenerator: ITokenGenerator,
		updateAccessTokenRepository: IUpdateAccessTokenRepository
	) {
		this.getUserByEmailRepository = getUserByEmailRepository;
		this.hashComparer = hashComparer;
		this.tokenGenerator = tokenGenerator;
		this.updateAccessTokenRepository = updateAccessTokenRepository;
	}

	async auth({ email, password }: IAuthenticationModel): Promise<string> {
		const user = await this.getUserByEmailRepository.load(email);

		if (!user?.id) {
			return null;
		}

		const validPassword = await this.hashComparer.compare(password, user.password);

		if (!validPassword) {
			return null;
		}
		const accessToken = await this.tokenGenerator.generate(user.id);

		await this.updateAccessTokenRepository.update(user.id, accessToken);

		return accessToken;
	}
}