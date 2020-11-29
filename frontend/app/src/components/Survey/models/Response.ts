import Survey from "./Survey";
import { range } from "../../../utilities/ArrayUtilities";

class Response {
  survey: Survey;
  choices: boolean[][];

  constructor(survey: Survey, choices: boolean[][]) {
    this.survey = survey;
    this.choices = choices;
  }

  static fromSurvey(survey: Survey) {
    const choices = survey.questions.map((question) =>
      question.options.map((_) => false)
    );
    return new Response(survey, choices);
  }

  isSurveyComplete() {
    const numQuestions = this.survey.questions.length;
    return range(numQuestions)
      .map((questionNumber) => this.isQuestionComplete(questionNumber))
      .every((x) => x);
  }

  isQuestionComplete(questionNumber: number) {
    const question = this.survey.questions[questionNumber];
    const questionChoices = this.choices[questionNumber];
    if (question.multiselect) {
      // TODO: Add multiselect logic for quesiton completion
      return true;
    } else {
      return questionChoices.some((x) => x);
    }
  }

  isOptionChosen(questionNumber: number, optionNumber: number) {
    return this.choices[questionNumber][optionNumber];
  }

  resetQuestion(questionNumber: number) {
    const numOptions = this.survey.questions[questionNumber].options.length;
    for (let optionNumber = 0; optionNumber < numOptions; optionNumber++) {
      this.choices[questionNumber][optionNumber] = false;
    }
  }

  updateOptionChoice(
    questionNumber: number,
    optionNumber: number,
    choice: boolean = true
  ) {
    const multiselect = this.survey.questions[questionNumber].multiselect;
    if (!multiselect) {
      this.resetQuestion(questionNumber);
    }
    this.choices[questionNumber][optionNumber] = choice;
  }

  toString() {
    let rep = "\n";
    this.choices.forEach((questionChoices) => {
      questionChoices.forEach((choice) => {
        rep += choice ? "[*]" : "[ ]";
      });
      rep += "\n";
    });
    return rep;
  }
}

export default Response;
