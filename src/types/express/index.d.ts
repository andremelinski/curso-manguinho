// eslint-disable-next-line @typescript-eslint/prefer-namespace-keyword
declare module Express {
	export interface Request {
		accountId?: string;
	}
}
