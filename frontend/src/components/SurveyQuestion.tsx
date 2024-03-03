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

export function SurveyQuestion(props: QuestionProps) {
  const response = props.response;
  const isComplete = response.isQuestionComplete(props.questionNumber);

  return (
    <div className="pb-5 pt-3" key={props.questionNumber}>
      <div
        className={cn(
          "pb-3 -indent-4 font-raleway text-text-1 transition-all",
          isComplete && "text-text-4",
        )}
      >
        {props.questionNumber + 1}
        {". "}
        {props.question.text}
      </div>
      <div className="Question-options">
        {props.question.options.map(
          (optionText: string, optionNumber: number) => (
            <SurveyQuestionOption
              key={optionNumber}
              questionNumber={props.questionNumber}
              optionText={optionText}
              optionNumber={optionNumber}
              onOptionClicked={props.onOptionClicked}
              response={props.response}
              updater={props.updater}
              questionComplete={isComplete}
            />
          ),
        )}
      </div>
    </div>
  );
}
