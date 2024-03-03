import { Question as QuestionModel, Response } from "../models/surveyModels";

import { cn } from "../utilities/styleUtilities";
import { SurveyQuestionOption } from "./SurveyQuestionOption";

interface QuestionProps {
  question: QuestionModel;
  questionNumber: number;
  onOptionClicked: (questionNumber: number, optionNumber: number) => void;
  response: Response;
  updater: boolean;
}

export function SurveyQuestion({
  question,
  questionNumber,
  onOptionClicked,
  response,
  updater,
}: QuestionProps) {
  const isComplete = response.isQuestionComplete(questionNumber);

  return (
    <div className="pb-5 pt-3" key={questionNumber}>
      <div
        className={cn(
          "pb-3 -indent-4 font-raleway text-text-1 transition-all",
          isComplete && "text-text-4",
        )}
      >
        {questionNumber + 1}
        {". "}
        {question.text}
      </div>
      <div className="Question-options">
        {question.options.map((optionText: string, optionNumber: number) => (
          <SurveyQuestionOption
            key={optionNumber}
            questionNumber={questionNumber}
            optionText={optionText}
            optionNumber={optionNumber}
            onOptionClicked={onOptionClicked}
            response={response}
            updater={updater}
            questionComplete={isComplete}
          />
        ))}
      </div>
    </div>
  );
}
