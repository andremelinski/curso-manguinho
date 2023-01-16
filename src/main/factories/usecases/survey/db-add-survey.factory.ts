import DbAddSurvey from '../../../../data/usecases/add-survey/db-add-survey.';
import SurveyMongoRepository from '../../../../infra/database/mongodb/survey-repository/survey-mongo.repository';

export const makeDbAddSurvey = (): DbAddSurvey => {
	return new DbAddSurvey(new SurveyMongoRepository());
};
