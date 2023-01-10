import { IController } from '../../../presentation/http/controller.interface';
import { LogControllerDecorator } from '../../decorator/logController.decorator';

export const makeLogControllerDecorator = (controller: IController): IController => {
	return new LogControllerDecorator(controller);
};