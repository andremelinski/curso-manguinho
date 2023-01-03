export interface IUpdateAccessTokenRepository {
	update(userId: string, token: string): Promise<void>;
}