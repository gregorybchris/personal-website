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
    let letter = String.fromCharCode(
      "A".charCodeAt(0) + this.props.optionNumber
    );
    return (
      <div
        onClick={() =>
          this.props.onOptionClicked(
            this.props.questionNumber,
            this.props.optionNumber
          )
        }
        className="Option"
        key={this.props.optionNumber}
      >
        {letter}) {this.props.optionText}
      </div>
    );
  }
}

export default Option;
