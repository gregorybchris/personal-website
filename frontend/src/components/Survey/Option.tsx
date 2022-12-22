import "./styles/Option.sass";

import Response from "./models/Response";

interface OptionProps {
  questionNumber: number;
  optionText: string;
  optionNumber: number;
  onOptionClicked: (questionNumber: number, optionNumber: number) => void;
  response: Response;
  updater: boolean;
}

export default function Option(props: OptionProps) {
  const letter = String.fromCharCode("A".charCodeAt(0) + props.optionNumber);
  const isChosen = props.response.isOptionChosen(props.questionNumber, props.optionNumber);
  const chosenClass = isChosen ? "chosen" : "";

  return (
    <div
      onClick={() => props.onOptionClicked(props.questionNumber, props.optionNumber)}
      className={`Option ${chosenClass}`}
      key={props.optionNumber}
    >
      {letter}) {props.optionText}
    </div>
  );
}
