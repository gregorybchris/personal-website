import SurveyQuestion from './SurveyQuestion'

interface Survey {
  survey_id: string;
  name: string;
  slug: string;
  date_created: string;
  questions: SurveyQuestion[];
  archived: boolean;
}

export default Survey;
