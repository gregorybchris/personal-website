import "../styles/common.css";

import { GET, POST, makeQuery } from "../utilities/requestUtilities";
import React, { useEffect, useState } from "react";
import { Response, Survey as SurveyModel } from "../models/surveyModels";

import { STORE } from "../utilities/storageUtilities";
import { SurveyQuestion } from "../components/SurveyQuestion";

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
        <div className="pt-10 mx-auto text-center">
          <div className="font-raleway text-text-1">Loading surveys...</div>
        </div>
      );
    }

    if (current === null || response == null) {
      return (
        <div className="pt-10 mx-auto text-center">
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
      <div className="w-[80%] md:w-[50%] py-10 text-center mx-auto">
        <div className="w-full text-left">
          <div className="mx-auto block text-center md:text-left border-b border-background font-noto text-2xl text-text-1 font-bold pb-1 md:inline md:border-accent">
            {survey.name}
          </div>
        </div>
        <div className="pt-3 pb-4 text-left">
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
        <div className="text-left w-full pb-10">
          <div className="font-raleway text-text-1 pb-3">Additional information you'd like to provide? (optional)</div>
          <textarea
            className="Common-text-field w-full h-[80px]"
            name="feedback"
            value={feedback}
            onChange={onUpdateFeedback}
            placeholder=""
          />
        </div>
        <div
          className={`Common-button inline-block mx-auto ${buttonDisabledClass}`}
          onClick={() => onSurveySubmit(survey, response)}
        >
          Submit Opinion
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="w-[80%] mx-auto text-center">
        <div className="font-noto text-text-1 text-3xl font-bold block mb-5 mt-8">What do you think?</div>
        <div className="font-raleway text-text-1 block w-[80%] mx-auto">
          Your responses here are totally anonymous, so take your time and answer honestly. These questions are intended
          to be fun and thought-provoking. I'll periodically add new surveys, so if you enjoy these, feel free to check
          back later.
        </div>
      </div>
      {getSurveyElement()}
    </div>
  );
}
