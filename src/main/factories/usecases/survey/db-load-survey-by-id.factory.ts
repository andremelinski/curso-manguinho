import DbLoadSurveyById from '../../../../data/usecases/load-survey/load-by-id/db-load-survey-by-id';
import SurveyMongoRepository from '../../../../infra/database/mongodb/survey-repository/survey-mongo.repository';

export const makeDbLoadByIdSurvey = (): DbLoadSurveyById => {
	return new DbLoadSurveyById(new SurveyMongoRepository());
};
