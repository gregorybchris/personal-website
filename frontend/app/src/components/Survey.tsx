import React from "react";

import "./Survey.css";
import { makeQuery, GET, POST } from "../controllers/RequestUtilities";
import SurveyRecord from "../models/SurveyRecord";
import SurveyQuestionRecord from "../models/SurveyQuestionRecord";

export interface SurveyProps {}

export interface SurveyState {
  surveys: SurveyRecord[];
  currentSurvey: SurveyRecord | null;
}

class Survey extends React.Component<SurveyProps, SurveyState> {
  state = {
    surveys: [],
    currentSurvey: null,
  };

  async componentDidMount() {
    const surveysQuery = makeQuery("surveys");
    const queryResult = await GET(surveysQuery);
    this.setState({ surveys: queryResult.reverse() });
    this.setState({ currentSurvey: this.state.surveys[0] });
  }

  getSurveyElement = (survey: SurveyRecord | null) => {
    if (survey == null) {
      return undefined;
    } else {
      return (
        <div className="Survey-content">
          <div className="Survey-name">{survey.name}</div>
          <div className="Survey-questions">
            {survey.questions.map((question, questionNumber) =>
              this.getSurveyQuestionElement(
                survey.survey_id,
                question,
                questionNumber
              )
            )}
          </div>
        </div>
      );
    }
  };

  getSurveyQuestionElement = (
    surveyId: string,
    question: SurveyQuestionRecord,
    questionNumber: number
  ) => {
    return (
      <div className="Survey-question" key={questionNumber}>
        <div className="Survey-question-text">
          {questionNumber + 1}
          {". "}
          {question.text}
        </div>
        <div className="Survey-question-options">
          {question.options.map((optionText, optionNumber) =>
            this.getSurveyQuestionOptionElement(
              surveyId,
              optionText,
              optionNumber,
              questionNumber
            )
          )}
        </div>
      </div>
    );
  };

  getSurveyQuestionOptionElement = (
    surveyId: string,
    optionText: string,
    optionNumber: number,
    questionNumber: number
  ) => {
    let letter = String.fromCharCode("A".charCodeAt(0) + optionNumber);
    return (
      <div
        onClick={() =>
          this.onOptionClicked(surveyId, questionNumber, optionNumber)
        }
        className="Survey-question-option"
        key={optionNumber}
      >
        {letter}) {optionText}
      </div>
    );
  };

  onOptionClicked = async (
    surveyId: string,
    questionNumber: number,
    optionNumber: number
  ) => {
    const postSurveyQuery = makeQuery(`surveys/${surveyId}`);
    const queryResult = await POST(postSurveyQuery);
    console.log(queryResult);
  };

  render() {
    return (
      <div className="Survey">
        <div className="Survey-about-wrap">
          <div className="Survey-about-title">What do you think?</div>
          <div className="Survey-about-text">
            Do you ever get so curious about something you wish you could poll
            the whole world? While guaranteed to fail, I thought I'd try that
            here. Please check back periodically for new topics. My sincere
            thanks for taking the time to give your opinion.
          </div>
        </div>
        {this.getSurveyElement(this.state.currentSurvey)}
      </div>
    );
  }
}

export default Survey;
