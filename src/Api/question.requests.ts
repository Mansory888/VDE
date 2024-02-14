import { MockExam } from '../models/mockExam';
import { fetchWithToken } from './fetch-wrapper';

export default class QuestionRequests {

    static async getExam(languageId:number): Promise<MockExam> {
        try {
          return await fetchWithToken('mockexams/create/'+languageId, );
        } catch (error: any) {
          throw Error(error.message);
        }
      }
}