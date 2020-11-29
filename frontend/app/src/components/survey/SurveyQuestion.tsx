import React from "react";

import SurveyResponse from "./models/SurveyResponse";
import SurveyOption from "./SurveyOption";
import SurveyQuestionModel from "./models/SurveyQuestion";
import "./styles/SurveyQuestion.sass";

export interface SurveyQuestionProps {
  surveyId: string;
  question: SurveyQuestionModel;
  questionNumber: number;
  onOptionClicked: (
    surveyId: string,
    questionNumber: number,
    optionNumber: number
  ) => void;
  response: SurveyResponse;
}

export interface SurveyQuestionState {}

class SurveyQuestion extends React.Component<
  SurveyQuestionProps,
  SurveyQuestionState
> {
  state = {};

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
                response={this.props.response}
              ></SurveyOption>
            )
          )}
        </div>
      </div>
    );
  }
}

export default SurveyQuestion;
