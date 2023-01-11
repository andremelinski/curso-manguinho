export interface IAuthenticationDto {
	email: string,
	password: string
}

export interface IAuthentication {
	auth(authentication: IAuthenticationDto): Promise<string>;
}