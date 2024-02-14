export interface Answer {
  answer_id: number;
  answer: string;
  questionId: number;
  is_correct: boolean;
  selected?: boolean;
}
