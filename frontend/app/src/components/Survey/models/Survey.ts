import Question from './Question'

interface Survey {
  survey_id: string;
  name: string;
  slug: string;
  date_created: string;
  questions: Question[];
  archived: boolean;
}

export default Survey;
