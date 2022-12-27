import express from 'express';

import setupMiddlewares from './middlewares';
import routesSetup from './routes';

const app = express();

setupMiddlewares(app);
routesSetup(app);
export default app;
