import DbLoadSurvey from '../../../../data/usecases/survey/load-survey/load-all/db-load-survey';
import { ILoadSurveys } from '../../../../domain/interfaces/usecases/survey/load-surveys.interface';
import SurveyMongoRepository from '../../../../infra/database/mongodb/survey-repository/survey-mongo.repository';

export const makeDbLoadSurveys = (): ILoadSurveys => {
	return new DbLoadSurvey(new SurveyMongoRepository());
};
