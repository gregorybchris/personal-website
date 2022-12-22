import "./styles/Question.sass";

import Option from "./Option";
import QuestionModel from "./models/Question";
import Response from "./models/Response";

interface QuestionProps {
  question: QuestionModel;
  questionNumber: number;
  onOptionClicked: (questionNumber: number, optionNumber: number) => void;
  response: Response;
  updater: boolean;
}

export default function Question(props: QuestionProps) {
  const response = props.response;
  const isComplete = response.isQuestionComplete(props.questionNumber);
  const completeClass = isComplete ? "complete" : "";

  return (
    <div className={`Question ${completeClass}`} key={props.questionNumber}>
      <div className="Question-text">
        {props.questionNumber + 1}
        {". "}
        {props.question.text}
      </div>
      <div className="Question-options">
        {props.question.options.map((optionText: string, optionNumber: number) => (
          <Option
            key={optionNumber}
            questionNumber={props.questionNumber}
            optionText={optionText}
            optionNumber={optionNumber}
            onOptionClicked={props.onOptionClicked}
            response={props.response}
            updater={props.updater}
          />
        ))}
      </div>
    </div>
  );
}
