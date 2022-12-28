import { MongoHelper } from '../infra/database/mongodb/helper/mongo.helper';
import app from './config/app';
import env from './config/env';


MongoHelper.connect(env.MONGO_URL)
	.then(async () => {
	// avoiding to import some dependencie that require db connection before db connection
		const app = (await import('./config/app')).default;

		app.listen(env.PORT, () => {
			console.log(`listening at: http://localhost:${env.PORT}`);
		});
	})
	.catch((err) => {
		return console.error(err);
	});
