import { MockExam } from '../models/mockExam';
import { QuestionReport } from '../models/questionReport';
import { fetchWithToken } from './fetch-wrapper';

export default class QuestionRequests {

  static async getExam(languageId: number): Promise<MockExam> {
    try {
      return await fetchWithToken('mockexams/create/' + languageId,);
    } catch (error: any) {
      throw Error(error.message);
    }
  }

  static async postQuestionReport(questionReport: QuestionReport): Promise<String> {
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify(questionReport),
      };

      return await fetchWithToken('questions/report', options);
    } catch (error: any) {
      throw Error(error.message);
    }
  }


}