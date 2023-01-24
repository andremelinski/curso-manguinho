import { IAddSurveyRepository } from '../../../../data/interfaces/db/add-survey-repository.interface';
import { ILoadSurveyRepository } from '../../../../data/interfaces/db/load-survey-repository.interface';
import { IAddSurveyDto } from '../../../../data/usecases/add-survey/db-add-survey-protocols';
import { ISurveyModel } from '../../../../domain/interfaces/model/survey-model-interface';
import { MongoHelper } from '../helper/mongo.helper';

export default class SurveyMongoRepository implements IAddSurveyRepository, ILoadSurveyRepository {
	async add(surveyData: IAddSurveyDto): Promise<void> {
		const surveyCollection = await this.getCollections('surveys');

		await surveyCollection.insertOne(surveyData);
	}

	async loadAll(): Promise<ISurveyModel[] | null> {
		const surveyCollection = await this.getCollections('surveys');
		const surveys: any = await surveyCollection.find({}).toArray();

		return surveys;
	}

	// eslint-disable-next-line consistent-return
	async getCollections(collection: string) {
		const collectionSet = collection.toLowerCase();
		const collectionArr = ['surveys', 'accounts'];

		if (collectionArr.find((el) => {
			return el === collectionSet;
		})) {
			const collectionConnected = await MongoHelper.getCollection(collection);

			return collectionConnected;
		}
	}
}