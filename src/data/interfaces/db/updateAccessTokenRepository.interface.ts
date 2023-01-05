export interface IUpdateAccessTokenRepository {
	updateAccessToken(userId: string, token: string): Promise<void>;
}