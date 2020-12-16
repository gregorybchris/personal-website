import React from "react";

import Response from "./models/Response";
import "./styles/Option.sass";

interface OptionProps {
  questionNumber: number;
  optionText: string;
  optionNumber: number;
  onOptionClicked: (questionNumber: number, optionNumber: number) => void;
  response: Response;
}

interface OptionState {}

class Option extends React.Component<OptionProps, OptionState> {
  render() {
    const letter = String.fromCharCode("A".charCodeAt(0) + this.props.optionNumber);
    const isChosen = this.props.response.isOptionChosen(this.props.questionNumber, this.props.optionNumber);
    const chosenClass = isChosen ? "chosen" : "";
    return (
      <div
        onClick={() => this.props.onOptionClicked(this.props.questionNumber, this.props.optionNumber)}
        className={`Option ${chosenClass}`}
        key={this.props.optionNumber}
      >
        {letter}) {this.props.optionText}
      </div>
    );
  }
}

export default Option;
