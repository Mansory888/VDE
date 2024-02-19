import { MockExam } from '../models/mockExam';
import { Question } from '../models/question';
import { QuestionList } from '../models/questionList';
import { QuestionReport } from '../models/questionReport';
import { Topic } from '../models/topic';
import { fetchWithToken } from './fetch-wrapper';

export default class QuestionRequests {

  static async getExam(languageId: number): Promise<MockExam> {
    try {
      return await fetchWithToken('mockexams/create/' + languageId,);
    } catch (error: any) {
      throw Error(error.message);
    }
  }

  static async getAllTopics(languageId: number): Promise<Topic[]> {
    try {
      return await fetchWithToken('topics/' + languageId,);
    } catch (error: any) {
      throw Error(error.message);
    }
  }

  static async getAllQuestionsForTopic(topicId: number): Promise<QuestionList> {
    try {
      return await fetchWithToken('topics/questions/' + topicId,);
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

  static async postQuestion(question: Question): Promise<Question> {
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify(question),
      };

      return await fetchWithToken('questions', options);
    } catch (error: any) {
      throw Error(error.message);
    }
  }


}