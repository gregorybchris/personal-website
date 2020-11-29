import SurveyQuestionRecord from './SurveyQuestionRecord'

interface ProjectRecord {
  survey_id: string;
  name: string;
  slug: string;
  date_created: string;
  questions: SurveyQuestionRecord[];
  archived: boolean;
}

export default ProjectRecord;
