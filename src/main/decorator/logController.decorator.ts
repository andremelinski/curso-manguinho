import { HttpReponse, HttpRequest, IController } from '../../presentation/http';

export class LogControllerDecorator implements IController {
	private readonly constroller: IController;

	constructor(controller: IController) {
		this.constroller = controller;
	}

	async handle(httpRequest: HttpRequest): Promise<HttpReponse> {
		const response = await this.constroller.handle(httpRequest);

		if (response.statusCode === 500) {
			console.error(response.body);
		}
		return response;
	}
}
