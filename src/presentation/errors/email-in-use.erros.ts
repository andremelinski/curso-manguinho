export class EmailInUseError extends Error {
	constructor(email: string) {
		super(`email ${email} already in use`);
		this.name = 'EmailInUseError';
	}
}
