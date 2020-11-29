interface SurveyQuestionRecord {
  question_id: string;
  text: string;
  type: string;
  options: string[];
  likert: any | null;
}
  
export default SurveyQuestionRecord;
