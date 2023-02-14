import DbAddSurvey from '../../../../data/usecases/survey/add-survey/db-add-survey';
import { IAddSurvey } from '../../../../domain/interfaces/usecases/survey/add-survey.interface';
import SurveyMongoRepository from '../../../../infra/database/mongodb/survey-repository/survey-mongo.repository';

export const makeDbAddSurvey = (): IAddSurvey => {
	return new DbAddSurvey(new SurveyMongoRepository());
};
