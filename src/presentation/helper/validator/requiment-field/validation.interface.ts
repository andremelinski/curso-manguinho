export interface IValidation {
	validate(object: any): Error | null;
}
