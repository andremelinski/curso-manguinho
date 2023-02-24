import express from 'express';

import setupMiddlewares from './middlewares';
import routesSetup from './routes';
import setupSwagger from './swagger.config';

const app = express();

setupSwagger(app);
setupMiddlewares(app);
routesSetup(app);
export default app;
