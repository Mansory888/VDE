import { QuestionList } from "./questionList";
import { User } from "./user";
export interface MockExam {
  mockexam_id?: number;
  user_id: number;
  percentage: number;
  completion_date?: Date;
  questions?: QuestionList;
  points?: number;
}
