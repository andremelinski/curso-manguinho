/* eslint-disable max-nested-callbacks */
import jwt from 'jsonwebtoken';

import JwtAdapter from './jwt-adapter';

const secretKey = 'secretKey';

jest.mock('jsonwebtoken', () => {
	return {
		sign(payload: string, secretKey: string): string {
			return 'token_generted';
		},
		verify(payload: string, secretKey: string): string {
			return 'token_verified';
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

	test('Should throw if jwt.sign throws', () => {
		jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
			throw new Error('stack_error');
		});
		expect(sut.encrypt).toThrow();
	});
});