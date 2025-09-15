import { Question as QuestionModel } from "../models/surveyModels";

import "../styles/common.css";
import { cn } from "../utilities/styleUtilities";

import React, { useEffect, useState } from "react";
import { Response, Survey as SurveyModel } from "../models/surveyModels";
import { GET, POST, makeQuery } from "../utilities/requestUtilities";

import { STORE } from "../utilities/storageUtilities";

export function SurveysPage() {
  const COMPLETED_KEY = "completed-surveys";

  const [surveys, setSurveys] = useState<SurveyModel[]>([]);
  const [current, setCurrent] = useState<SurveyModel | null>(null);
  const [response, setResponse] = useState<Response | null>(null);
  const [feedback, setFeedback] = useState("");
  const [updater, setUpdater] = useState(false);

  useEffect(() => {
    const surveysQuery = makeQuery("surveys");
    GET(surveysQuery).then((surveys: SurveyModel[]) => {
      surveys = surveys.filter((survey) => !survey.archived);
      setSurveys(surveys);
      if (!STORE.contains(COMPLETED_KEY)) {
        STORE.set(COMPLETED_KEY, []);
      }
    });
  }, []);

  useEffect(() => {
    setCurrentSurvey();
  }, [surveys]);

  function setCurrentSurvey() {
    if (surveys.length > 0) {
      const completedIds: Array<string> = STORE.get(COMPLETED_KEY);
      let current: SurveyModel | null = null;
      for (let i = 0; i < surveys.length; i++) {
        if (!completedIds.includes(surveys[i].survey_id)) {
          current = surveys[i];
        }
      }

      if (current === null) {
        setCurrent(null);
        setResponse(null);
        setFeedback("");
      } else {
        setCurrent(current);
        setResponse(Response.fromSurvey(current));
        setFeedback("");
      }
    }
  }

  function onOptionClicked(question: number, option: number) {
    if (response !== null) {
      const chosen = response.isOptionChosen(question, option);
      response.updateOptionChoice(question, option, !chosen);
    }
    setResponse(response);
    setUpdater((prev) => !prev);
  }

  async function onSurveySubmit(survey: SurveyModel, response: Response) {
    if (response.isSurveyComplete()) {
      const surveyId = survey.survey_id;
      const postSurveyQuery = makeQuery(`surveys/${surveyId}`);
      const postBody = {
        choices: response.choices,
        feedback,
      };
      await POST(postSurveyQuery, postBody);
      const completedIds = STORE.get(COMPLETED_KEY);
      completedIds.push(surveyId);
      STORE.set(COMPLETED_KEY, completedIds, true);
      setCurrentSurvey();
    }
  }

  function onClearCompletedCache() {
    STORE.set(COMPLETED_KEY, [], true);
    setCurrentSurvey();
  }

  function onUpdateFeedback(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setFeedback(event.target.value);
  }

  function getSurveyElement() {
    if (surveys.length === 0) {
      return (
        <div className="mx-auto pt-10 text-center">
          <div className="font-raleway text-text-1">Loading surveys...</div>
        </div>
      );
    }

    if (current === null || response == null) {
      return (
        <div className="mx-auto pt-10 text-center">
          <div className="font-raleway text-text-1">
            No more surveys to complete
            <span onClick={onClearCompletedCache}>!</span>
          </div>
        </div>
      );
    }

    const survey = current;
    const isComplete = response.isSurveyComplete();
    const buttonDisabledClass = isComplete ? "" : "disabled";
    return (
      <div className="mx-auto w-[80%] py-10 text-center md:w-[50%]">
        <div className="w-full text-left">
          <div className="mx-auto block border-b border-background pb-1 text-center font-noto text-2xl font-bold text-text-1 md:inline md:border-accent md:text-left">
            {survey.name}
          </div>
        </div>
        <div className="pb-4 pt-3 text-left">
          {survey.questions.map((question, questionNumber) => (
            <SurveyQuestion
              key={questionNumber}
              question={question}
              questionNumber={questionNumber}
              onOptionClicked={onOptionClicked}
              response={response}
              updater={updater}
            />
          ))}
        </div>
        <div className="w-full pb-10 text-left">
          <div className="pb-3 font-raleway text-text-1">
            Additional information you'd like to provide? (optional)
          </div>
          <textarea
            className="Common-text-field h-[80px] w-full"
            name="feedback"
            value={feedback}
            onChange={onUpdateFeedback}
            placeholder=""
          />
        </div>
        <div
          className={`Common-button mx-auto inline-block ${buttonDisabledClass}`}
          onClick={() => onSurveySubmit(survey, response)}
        >
          Submit Opinion
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="mx-auto w-[80%] text-center">
        <div className="mb-5 mt-8 block font-noto text-3xl font-bold text-text-1">
          What do you think?
        </div>
        <div className="mx-auto block w-[80%] font-raleway text-text-1">
          Your responses here are totally anonymous, so take your time and
          answer honestly. These questions are intended to be fun and
          thought-provoking. I'll periodically add new surveys, so if you enjoy
          these, feel free to check back later.
        </div>
      </div>
      {getSurveyElement()}
    </div>
  );
}

interface QuestionProps {
  question: QuestionModel;
  questionNumber: number;
  onOptionClicked: (questionNumber: number, optionNumber: number) => void;
  response: Response;
  updater: boolean;
}

function SurveyQuestion({
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

interface SurveyQuestionOptionProps {
  questionNumber: number;
  optionText: string;
  optionNumber: number;
  onOptionClicked: (questionNumber: number, optionNumber: number) => void;
  response: Response;
  updater: boolean;
  questionComplete: boolean;
}

function SurveyQuestionOption({
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
