export interface IAuthenticator {
	validate(object: any): Promise<string>;
}