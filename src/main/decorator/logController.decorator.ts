import { HttpReponse, HttpRequest, IController } from '../../presentation/http';

export class LogControllerDecorator implements IController {
	constructor(private readonly controller: IController) {}

	async handle(httpRequest: HttpRequest): Promise<HttpReponse> {
		const response = await this.controller.handle(httpRequest);

		if (response.statusCode === 500) {
			console.error(response.body);
		}
		return response;
	}
}
