interface Question {
  question_id: string;
  text: string;
  type: string;
  required: boolean;
  multiselect: boolean;
  options: string[];
  likert: any | null;
}

export default Question;
