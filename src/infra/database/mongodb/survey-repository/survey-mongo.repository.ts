import { IAddSurveyRepository } from '../../../../data/interfaces/db/add-survey-repository.interface';
import { IAddSurveyDto } from '../../../../data/usecases/add-survey/db-add-survey-protocols';
import { MongoHelper } from '../helper/mongo.helper';

export default class SurveyMongoRepository implements IAddSurveyRepository {
	async add(surveyData: IAddSurveyDto): Promise<void> {
		const surveyCollection = await MongoHelper.getCollection('surveys');

		await surveyCollection.insertOne(surveyData);
	}
}