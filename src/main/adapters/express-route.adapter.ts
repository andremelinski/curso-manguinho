import { Request, Response } from 'express';

import { HttpReponse, HttpRequest, IController } from '../../presentation/http';

export const adaptRoute = (controller: IController) => {
	return async (req: Request, res: Response) => {
		const httpRequest: HttpRequest = { body: req.body, params: req.params, accountId: req.accountId };

		const httpResponse: HttpReponse = await controller.handle(httpRequest);

		if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
			res.status(httpResponse.statusCode).json(httpResponse.body);
		} else {
			res.status(httpResponse.statusCode).json({ error: httpResponse.body.message });
		}
		// res.status(httpResponse.statusCode).json(httpResponse.body);
	};
};