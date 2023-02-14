import { Collection, ObjectId } from 'mongodb';

import { IAddSurveyRepository } from '../../../../data/interfaces/db/add-survey-repository.interface';
import { ILoadSurveyRepository } from '../../../../data/interfaces/db/load-survey-repository.interface';
import { IAddSurveyDto } from '../../../../data/usecases/survey/add-survey/db-add-survey-protocols';
import { ISurveyModel, ISurveyResultModel } from '../../../../domain/interfaces/model/survey-model-interface';
import { ISaveSurveyResultDto } from '../../../../domain/interfaces/usecases/survey/add-survey.interface';
import { ILoadSurveyById } from '../../../../domain/interfaces/usecases/survey/load-surveys.interface';
import { MongoHelper } from '../helper/mongo.helper';

export default class SurveyMongoRepository
implements IAddSurveyRepository, ILoadSurveyRepository, ILoadSurveyById {
	async add(surveyData: IAddSurveyDto): Promise<void> {
		const surveyCollection = await MongoHelper.connectToCollections('surveys');

		await surveyCollection.insertOne(surveyData);
	}

	async loadAll(): Promise<ISurveyModel[] | null> {
		const surveyCollection = await MongoHelper.connectToCollections('surveys');
		const surveys: any = await surveyCollection.find({}).toArray();

		return surveys && MongoHelper.mapCollection(surveys);
	}

	async loadById(surveyId: string): Promise<ISurveyModel> {
		const surveyCollection : Collection = await MongoHelper.connectToCollections('surveys');
		const survey: any = await surveyCollection.findOne({ _id: new ObjectId(surveyId) });

		return survey && MongoHelper.mapper(survey);
	}

	async save(data: ISaveSurveyResultDto): Promise<ISurveyResultModel> {
		const surveyResultCollection = await MongoHelper.connectToCollections('surveyResults');
		const surveyResult: any = await surveyResultCollection.findOneAndUpdate(
			{
				surveyId: data.surveyId,
				accountId: data.accountId,
			},
			{
				$set: {
					answer: data.answer,
					date: data.date,
				},
			},
			{
				upsert: true,
				returnDocument : 'after'
			}
		);

		return surveyResult.value && MongoHelper.mapper(surveyResult.value);
	}
}