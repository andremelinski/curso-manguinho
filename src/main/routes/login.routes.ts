import { Router } from 'express';

import { adaptRoute } from '../adapters/express-route.adapter';
import { makeLoginController } from '../factories/login/login';
import { makeSignUpController } from '../factories/sign-up/sign-up';

export default (router: Router): void => {
	router.post('/signup', adaptRoute(makeSignUpController()));
	router.post('/login', adaptRoute(makeLoginController()));
};