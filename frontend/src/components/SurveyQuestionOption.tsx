import { Response } from "../models/surveyModels";
import { cn } from "../utilities/styleUtilities";

interface SurveyQuestionOptionProps {
  questionNumber: number;
  optionText: string;
  optionNumber: number;
  onOptionClicked: (questionNumber: number, optionNumber: number) => void;
  response: Response;
  updater: boolean;
  questionComplete: boolean;
}

export function SurveyQuestionOption(props: SurveyQuestionOptionProps) {
  const letter = String.fromCharCode("A".charCodeAt(0) + props.optionNumber);
  const isChosen = props.response.isOptionChosen(
    props.questionNumber,
    props.optionNumber,
  );

  return (
    <div
      onClick={() =>
        props.onOptionClicked(props.questionNumber, props.optionNumber)
      }
      className={cn(
        "px-3 py-1 font-raleway text-accent transition-all",
        isChosen && "bg-background-highlight-light",
        "active:bg-background-highlight-active",
        "cursor-pointer hover:bg-background-highlight hover:text-accent-focus",
        props.questionComplete && "text-accent-light",
      )}
      key={props.optionNumber}
    >
      {letter}&#41; {props.optionText}
    </div>
  );
}
