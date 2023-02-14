import DbSaveSurveyResult from '../../../../data/usecases/survey/save-survey-result/db-save-survey';
import { ISaveSurveyResult } from '../../../../domain/interfaces/usecases/survey/add-survey.interface';
import SurveyMongoRepository from '../../../../infra/database/mongodb/survey-repository/survey-mongo.repository';

export const makeSaveSurveyResult = (): ISaveSurveyResult => {
	return new DbSaveSurveyResult(new SurveyMongoRepository());
};