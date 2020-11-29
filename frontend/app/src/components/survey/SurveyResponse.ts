import SurveyRecord from "../../models/SurveyRecord";

class SurveyResponse {
  optionCounts: number[]

  constructor(optionCounts: number[]) {
    this.optionCounts = optionCounts
  }

  static fromRecord(surveyRecord: SurveyRecord) {
    const counts = surveyRecord.questions.map(question => question.options.length)
    return new SurveyResponse(counts)
  }
}

export default SurveyResponse