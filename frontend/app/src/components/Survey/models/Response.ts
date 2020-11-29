import Survey from "./Survey";

class Response {
  survey: Survey;
  selections: boolean[][];

  constructor(survey: Survey, selections: boolean[][]) {
    this.survey = survey;
    this.selections = selections;
  }

  static fromSurvey(survey: Survey) {
    const counts = survey.questions.map((question) =>
      question.options.map((_) => false)
    );
    return new Response(survey, counts);
  }

  toString() {
    let rep = "\n";
    this.selections.forEach((questionSelections) => {
      questionSelections.forEach((optionSelection) => {
        rep += optionSelection ? "[*]" : "[ ]";
      });
      rep += "\n";
    });
    return rep;
  }
}

export default Response;
