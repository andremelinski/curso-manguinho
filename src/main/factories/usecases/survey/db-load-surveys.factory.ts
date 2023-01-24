import DbLoadSurvey from '../../../../data/usecases/load-survey/db-load-survey';
import SurveyMongoRepository from '../../../../infra/database/mongodb/survey-repository/survey-mongo.repository';

export const makeDbLoadSurveys = (): DbLoadSurvey => {
	return new DbLoadSurvey(new SurveyMongoRepository());
};
