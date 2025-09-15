import React, { useEffect, useState } from "react";
import "../styles/common.css";
import { range } from "../utilities/array-utilities";
import { GET, POST, makeQuery } from "../utilities/request-utilities";
import { STORE } from "../utilities/storage-utilities";
import { cn } from "../utilities/style-utilities";

export interface Question {
  question_id: string;
  text: string;
  type: string;
  required: boolean;
  multiselect: boolean;
  options: string[];
  likert: any | null;
}

export interface Survey {
  survey_id: string;
  name: string;
  slug: string;
  date_created: string;
  questions: Question[];
  archived: boolean;
}

export class Response {
  survey: Survey;
  choices: boolean[][];

  constructor(survey: Survey, choices: boolean[][]) {
    this.survey = survey;
    this.choices = choices;
  }

  static fromSurvey(survey: Survey) {
    const choices = survey.questions.map((question) =>
      question.options.map((_) => false),
    );
    return new Response(survey, choices);
  }

  isSurveyComplete() {
    const numQuestions = this.survey.questions.length;
    return range(numQuestions)
      .map((questionNumber) => {
        const questionComplete = this.isQuestionComplete(questionNumber);
        const questionRequired = this.survey.questions[questionNumber].required;
        return questionComplete && questionRequired;
      })
      .every((x) => x);
  }

  isQuestionComplete(questionNumber: number) {
    const question = this.survey.questions[questionNumber];
    const questionChoices = this.choices[questionNumber];
    if (question.multiselect) {
      // TODO: Add multiselect logic for question completion
      return true;
    } else {
      return questionChoices.some((x) => x);
    }
  }

  isOptionChosen(questionNumber: number, optionNumber: number) {
    return this.choices[questionNumber][optionNumber];
  }

  resetQuestion(questionNumber: number) {
    const numOptions = this.survey.questions[questionNumber].options.length;
    for (let optionNumber = 0; optionNumber < numOptions; optionNumber++) {
      this.choices[questionNumber][optionNumber] = false;
    }
  }

  updateOptionChoice(
    questionNumber: number,
    optionNumber: number,
    choice: boolean = true,
  ) {
    const multiselect = this.survey.questions[questionNumber].multiselect;
    if (!multiselect) {
      this.resetQuestion(questionNumber);
    }
    this.choices[questionNumber][optionNumber] = choice;
  }
}

export function SurveysPage() {
  const COMPLETED_KEY = "completed-surveys";

  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [current, setCurrent] = useState<Survey | null>(null);
  const [response, setResponse] = useState<Response | null>(null);
  const [feedback, setFeedback] = useState("");
  const [updater, setUpdater] = useState(false);

  useEffect(() => {
    const surveysQuery = makeQuery("surveys");
    GET(surveysQuery).then((surveys: Survey[]) => {
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
      let current: Survey | null = null;
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

  async function onSurveySubmit(survey: Survey, response: Response) {
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
            <SurveyQuestionCard
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

interface SurveyQuestionCardProps {
  question: Question;
  questionNumber: number;
  onOptionClicked: (questionNumber: number, optionNumber: number) => void;
  response: Response;
  updater: boolean;
}

function SurveyQuestionCard({
  question,
  questionNumber,
  onOptionClicked,
  response,
  updater,
}: SurveyQuestionCardProps) {
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
