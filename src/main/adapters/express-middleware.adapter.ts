import { NextFunction, Request, Response } from 'express';

import { HttpReponse, HttpRequest, IMiddleware } from '../../presentation/http';

export const adaptMiddleware = (middleware: IMiddleware) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const httpRequest: HttpRequest = { headers: req.headers };
		const httpResponse: HttpReponse = await middleware.handle(httpRequest);

		if (httpResponse.statusCode === 200) {
			Object.assign(req, httpResponse.body);
			next();
		} else {
			res.status(httpResponse.statusCode).json({ error: httpResponse.body.message });
		}
	};
};