import Question from "./Question";

export default interface Survey {
  survey_id: string;
  name: string;
  slug: string;
  date_created: string;
  questions: Question[];
  archived: boolean;
}
