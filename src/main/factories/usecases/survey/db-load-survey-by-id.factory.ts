import DbLoadSurveyById from '../../../../data/usecases/survey/load-survey/load-by-id/db-load-survey-by-id';
import { ILoadSurveyById } from '../../../../domain/interfaces/usecases/survey/load-surveys.interface';
import SurveyMongoRepository from '../../../../infra/database/mongodb/survey-repository/survey-mongo.repository';

export const makeDbLoadSurveyById = (): ILoadSurveyById => {
	return new DbLoadSurveyById(new SurveyMongoRepository());
};
