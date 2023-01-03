export interface IHashCompare {
	compare(userPassword: string, hashedPassword: string): Promise<boolean>;
}