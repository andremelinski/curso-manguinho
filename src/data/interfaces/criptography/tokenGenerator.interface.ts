export interface ITokenGenerator {
	generate(userId: string): Promise<string>;
}