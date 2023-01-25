import { adaptMiddleware } from '../adapters/express-middleware.adapter';
import { makeAuthMiddleware } from '../factories/controllers/middleware/auth-midleware';

export const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'));
export const auth = adaptMiddleware(makeAuthMiddleware());
