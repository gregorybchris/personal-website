import React from "react";

import "./SurveyQuestion.sass";
import SurveyOption from "./SurveyOption";
import SurveyQuestionRecord from "../../models/SurveyQuestionRecord";

export interface SurveyQuestionProps {
  surveyId: string;
  question: SurveyQuestionRecord;
  questionNumber: number;
  onOptionClicked: (
    surveyId: string,
    questionNumber: number,
    optionNumber: number
  ) => void;
}

export interface SurveyQuestionState {}

class SurveyQuestion extends React.Component<
  SurveyQuestionProps,
  SurveyQuestionState
> {
  state = {};

  getSurveyQuestionOptionElement = (
    surveyId: string,
    optionText: string,
    optionNumber: number,
    questionNumber: number
  ) => {};

  render() {
    return (
      <div className="SurveyQuestion" key={this.props.questionNumber}>
        <div className="SurveyQuestion-text">
          {this.props.questionNumber + 1}
          {". "}
          {this.props.question.text}
        </div>
        <div className="SurveyQuestion-options">
          {this.props.question.options.map(
            (optionText: string, optionNumber: number) => (
              <SurveyOption
                key={optionNumber}
                surveyId={this.props.surveyId}
                questionNumber={this.props.questionNumber}
                optionText={optionText}
                optionNumber={optionNumber}
                onOptionClicked={this.props.onOptionClicked}
              ></SurveyOption>
            )
          )}
        </div>
      </div>
    );
  }
}

export default SurveyQuestion;
