/* eslint-disable max-nested-callbacks */
import jwt from 'jsonwebtoken';

import JwtAdapter from './jwt-adapter';

const secretKey = 'secretKey';

jest.mock('jsonwebtoken', () => {
	return {
		sign(payload: string, secretKey: string): string {
			return 'token_generted';
		},
		verify(payload: string, secretKey: string): any {
			return { id: 'user_id', iat: 1674242324 };
		},
	};
});

const makeSut = (): JwtAdapter => {
	return new JwtAdapter(secretKey);
};

describe('Jwt adapter', () => {
	let sut: JwtAdapter;

	beforeEach(() => {
		sut = makeSut();
	});
	test('should call jwt sign with correct values', () => {
		const signSpy = jest.spyOn(jwt, 'sign');

		sut.encrypt('user_id');
		expect(signSpy).toHaveBeenCalledWith({ id: 'user_id' }, secretKey);
	});

	test('should call jwt.sign with correct values', () => {
		const jwtToken = sut.encrypt('user_id');

		expect(jwtToken).toEqual('token_generted');
	});

	test('should call jwt.verify with correct values', () => {
		const verifySpy = jest.spyOn(jwt, 'verify');

		sut.decrypt('token_generted');
		expect(verifySpy).toHaveBeenCalledWith('token_generted', secretKey);
	});

	test('should call jwt.verify with correct values', () => {
		const tokenValue = sut.decrypt('token_generted');

		expect(tokenValue).toEqual('user_id');
	});

	test('Should throw if jwt.sign throws', () => {
		jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
			throw new Error('stack_error');
		});
		expect(sut.encrypt).toThrow();
	});
	test('Should throw if jwt.verify throws', () => {
		jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
			throw new Error('stack_error');
		});
		expect(sut.encrypt).toThrow();
	});
});
