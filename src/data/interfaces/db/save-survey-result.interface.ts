import { ISurveyResultModel } from '../../../domain/interfaces/model/survey-model-interface';
import { ISaveSurveyResultDto } from '../../../domain/interfaces/usecases/survey/add-survey.interface';

export interface ISaveSurveyResultRepository {
	save(data: ISaveSurveyResultDto): Promise<ISurveyResultModel>;
}
