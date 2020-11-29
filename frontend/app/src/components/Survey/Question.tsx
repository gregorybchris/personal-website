import React from "react";

import Response from "./models/Response";
import Option from "./Option";
import QuestionModel from "./models/Question";
import "./styles/Question.sass";

interface QuestionProps {
  question: QuestionModel;
  questionNumber: number;
  onOptionClicked: (questionNumber: number, optionNumber: number) => void;
  response: Response;
}

interface QuestionState {}

class Question extends React.Component<QuestionProps, QuestionState> {
  render() {
    const response = this.props.response;
    const isComplete = response.isQuestionComplete(this.props.questionNumber);
    const completeClass = isComplete ? "complete" : "";
    return (
      <div
        className={`Question ${completeClass}`}
        key={this.props.questionNumber}
      >
        <div className="Question-text">
          {this.props.questionNumber + 1}
          {". "}
          {this.props.question.text}
        </div>
        <div className="Question-options">
          {this.props.question.options.map(
            (optionText: string, optionNumber: number) => (
              <Option
                key={optionNumber}
                questionNumber={this.props.questionNumber}
                optionText={optionText}
                optionNumber={optionNumber}
                onOptionClicked={this.props.onOptionClicked}
                response={this.props.response}
              ></Option>
            )
          )}
        </div>
      </div>
    );
  }
}

export default Question;
