import { Answer } from "./answer";
export interface Question {
  question_id: number;
  question: string;
  topic_id: number;
  image: string;
  explanation: string;
  answers: Answer[];
  status: string;
}
