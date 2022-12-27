import { Express } from 'express';

import { bodyParser, cors } from '../middlewares';

export default (app: Express): void => {
	app.use(cors);
	app.use(bodyParser);
};
