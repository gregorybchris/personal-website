import { useEffect, useState } from "react";
import { Button } from "../components/button";
import { TextArea } from "../components/text-area";
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

const COMPLETED_KEY = "completed-surveys";

export function SurveysPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [currentSurvey, setCurrentSurvey] = useState<Survey | null>(null);
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
    updateCurrentSurvey();
  }, [surveys]);

  function updateCurrentSurvey() {
    if (surveys.length > 0) {
      const completedIds: Array<string> = STORE.get(COMPLETED_KEY);
      let current: Survey | null = null;
      for (let i = 0; i < surveys.length; i++) {
        if (!completedIds.includes(surveys[i].survey_id)) {
          current = surveys[i];
        }
      }

      if (current === null) {
        setCurrentSurvey(null);
        setResponse(null);
        setFeedback("");
      } else {
        setCurrentSurvey(current);
        setResponse(Response.fromSurvey(current));
        setFeedback("");
      }
    }
  }

  function onClearCompletedCache() {
    STORE.set(COMPLETED_KEY, [], true);
    updateCurrentSurvey();
  }

  return (
    <div className="flex flex-col items-center gap-5 pt-5">
      <div className="font-sanchez text-3xl text-black/75">
        What do you think?
      </div>
      <div className="w-[80%] text-center text-black/75">
        Your responses here are totally anonymous, so take your time and answer
        honestly. These questions are intended to be fun and thought-provoking.
        I'll periodically add new surveys, so if you enjoy these, feel free to
        check back later.
      </div>

      {surveys.length === 0 && (
        <div className="pt-10 text-center">
          <div className="text-black/75">Loading surveys...</div>
        </div>
      )}

      {surveys.length > 0 && (currentSurvey === null || response === null) && (
        <div className="pt-10 text-center">
          <div className="text-black/75">
            No more surveys to complete
            <span onClick={onClearCompletedCache}>!</span>
          </div>
        </div>
      )}

      {surveys.length > 0 && currentSurvey !== null && response !== null && (
        <SurveyCard
          currentSurvey={currentSurvey}
          response={response}
          setResponse={setResponse}
          feedback={feedback}
          setFeedback={setFeedback}
          setUpdater={setUpdater}
          updateCurrentSurvey={updateCurrentSurvey}
        />
      )}
    </div>
  );
}

interface SurveyCardProps {
  currentSurvey: Survey;
  response: Response;
  feedback: string;
  setResponse: (response: Response | null) => void;
  setFeedback: (text: string) => void;
  setUpdater: (uf: (prev: boolean) => boolean) => void;
  updateCurrentSurvey: () => void;
}

function SurveyCard({
  currentSurvey,
  response,
  feedback,
  setResponse,
  setFeedback,
  setUpdater,
  updateCurrentSurvey,
}: SurveyCardProps) {
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
      updateCurrentSurvey();
    }
  }

  function onUpdateFeedback(text: string) {
    setFeedback(text);
  }

  const isComplete = response.isSurveyComplete();
  return (
    <div className="flex w-[80%] flex-col items-center gap-5 py-10 md:w-[50%]">
      <div className="font-sanchez text-2xl text-black/75 underline decoration-blue-500/60 underline-offset-4">
        {currentSurvey.name}
      </div>

      <div className="flex flex-col gap-5 text-left">
        {currentSurvey.questions.map((question, questionNumber) => (
          <QuestionCard
            key={questionNumber}
            question={question}
            questionNumber={questionNumber}
            onOptionClicked={onOptionClicked}
            response={response}
          />
        ))}
      </div>

      <div className="w-full text-left">
        <TextArea
          className="h-[80px] w-full"
          value={feedback}
          onChange={onUpdateFeedback}
          placeholder="Additional information you'd like to provide? (optional)"
        />
      </div>

      <Button
        text="Submit"
        onClick={() => onSurveySubmit(currentSurvey, response)}
        enabled={isComplete}
      />
    </div>
  );
}

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  onOptionClicked: (questionNumber: number, optionNumber: number) => void;
  response: Response;
}

function QuestionCard({
  question,
  questionNumber,
  onOptionClicked,
  response,
}: QuestionCardProps) {
  const isComplete = response.isQuestionComplete(questionNumber);

  return (
    <div className="flex flex-col gap-1" key={questionNumber}>
      <div
        className={cn(
          "-indent-4 text-black/75 transition-all",
          isComplete && "text-black/30",
        )}
      >
        {questionNumber + 1}
        {". "}
        {question.text}
      </div>

      <div className="flex flex-col gap-0.5">
        {question.options.map((optionText: string, optionNumber: number) => (
          <OptionCard
            key={optionNumber}
            questionNumber={questionNumber}
            optionText={optionText}
            optionNumber={optionNumber}
            onOptionClicked={onOptionClicked}
            response={response}
            questionComplete={isComplete}
          />
        ))}
      </div>
    </div>
  );
}

interface OptionCardProps {
  questionNumber: number;
  optionText: string;
  optionNumber: number;
  onOptionClicked: (questionNumber: number, optionNumber: number) => void;
  response: Response;
  questionComplete: boolean;
}

function OptionCard({
  questionNumber,
  optionText,
  optionNumber,
  onOptionClicked,
  response,
  questionComplete,
}: OptionCardProps) {
  const letter = String.fromCharCode("A".charCodeAt(0) + optionNumber);
  const isChosen = response.isOptionChosen(questionNumber, optionNumber);

  return (
    <div
      onClick={() => onOptionClicked(questionNumber, optionNumber)}
      className={cn(
        "cursor-pointer rounded px-3 py-0.5 text-accent transition-all hover:bg-black/5 hover:text-royal",
        isChosen && "bg-black/5 hover:bg-black/10",
        questionComplete && "text-royal/40",
      )}
      key={optionNumber}
    >
      {letter}&#41; {optionText}
    </div>
  );
}
