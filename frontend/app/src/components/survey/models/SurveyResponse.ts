import Survey from "./Survey";

class SurveyResponse {
  optionCounts: number[]

  constructor(optionCounts: number[]) {
    this.optionCounts = optionCounts
  }

  static fromSurvey(survey: Survey) {
    const counts = survey.questions.map(question => question.options.length)
    return new SurveyResponse(counts)
  }
}

export default SurveyResponse