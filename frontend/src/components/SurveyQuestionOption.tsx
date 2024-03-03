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

export function SurveyQuestionOption({
  questionNumber,
  optionText,
  optionNumber,
  onOptionClicked,
  response,
  updater,
  questionComplete,
}: SurveyQuestionOptionProps) {
  const letter = String.fromCharCode("A".charCodeAt(0) + optionNumber);
  const isChosen = response.isOptionChosen(questionNumber, optionNumber);

  return (
    <div
      onClick={() => onOptionClicked(questionNumber, optionNumber)}
      className={cn(
        "px-3 py-1 font-raleway text-accent transition-all",
        isChosen && "bg-background-highlight-light",
        "active:bg-background-highlight-active",
        "cursor-pointer hover:bg-background-highlight hover:text-accent-focus",
        questionComplete && "text-accent-light",
      )}
      key={optionNumber}
    >
      {letter}&#41; {optionText}
    </div>
  );
}
