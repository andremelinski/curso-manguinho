import { Request, Response } from 'express';
import { IController, HttpRequest, HttpReponse } from '../../presentation/http';

export const adaptRoute = (controller: IController) => {
	return async (req: Request, res: Response) => {
		const httpRequest: HttpRequest = { body: req.body };
		const httpResponse: HttpReponse = await controller.handle(httpRequest);

		res.status(httpResponse.statusCode).json(httpResponse.body);
	};
};