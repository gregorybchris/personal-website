import React from "react";

import SurveyResponse from "./models/SurveyResponse";
import "./styles/SurveyOption.sass";

export interface SurveyOptionProps {
  surveyId: string;
  questionNumber: number;
  optionText: string;
  optionNumber: number;
  onOptionClicked: (
    surveyId: string,
    questionNumber: number,
    optionNumber: number
  ) => void;
  response: SurveyResponse;
}

export interface SurveyOptionState {}

class SurveyOption extends React.Component<
  SurveyOptionProps,
  SurveyOptionState
> {
  render() {
    let letter = String.fromCharCode(
      "A".charCodeAt(0) + this.props.optionNumber
    );
    return (
      <div
        onClick={() =>
          this.props.onOptionClicked(
            this.props.surveyId,
            this.props.questionNumber,
            this.props.optionNumber
          )
        }
        className="SurveyOption"
        key={this.props.optionNumber}
      >
        {letter}) {this.props.optionText}
      </div>
    );
  }
}

export default SurveyOption;
