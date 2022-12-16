import { SignUpController } from './signup.controller';

describe('Sign Up Controller', () => {
	test('Should return 400 if no name is provided', () => {
		const sut = new SignUpController();
		const httpRequest = {
			body: {
				email: 'andre@email.com',
				password: 'a123',
				passwordConfirmation: 'a123',
			},
		};

		const httpResponse = sut.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new Error('Missing param: name'));
	});
	test('Should return 400 if no email is provided', () => {
		const sut = new SignUpController();
		const httpRequest = {
			body: {
				name: 'andre',
				password: 'a123',
				passwordConfirmation: 'a123',
			},
		};

		const httpResponse = sut.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new Error('Missing param: email'));
	});
});
