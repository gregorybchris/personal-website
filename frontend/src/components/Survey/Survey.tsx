import "./styles/Survey.sass";

import { GET, POST, makeQuery } from "../../utilities/requestUtilities";
import React, { useEffect, useState } from "react";

import Question from "./Question";
import Response from "./models/Response";
import { STORE } from "../../utilities/storageUtilities";
import SurveyModel from "./models/Survey";

export default function Survey() {
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

  function getSurveyElement() {
    if (surveys.length === 0) {
      return (
        <div className="Survey-message-wrap">
          <div className="Survey-message-text">Loading surveys...</div>
        </div>
      );
    }

    if (current === null || response == null) {
      return (
        <div className="Survey-message-wrap">
          <div className="Survey-message-text">
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
      <div className="Survey-content">
        <div className="Survey-name-wrap">
          <div className="Survey-name">{survey.name}</div>
        </div>
        <div className="Survey-questions">
          {survey.questions.map((question, questionNumber) => (
            <Question
              key={questionNumber}
              question={question}
              questionNumber={questionNumber}
              onOptionClicked={onOptionClicked}
              response={response}
              updater={updater}
            />
          ))}
        </div>
        <div className="Survey-feedback-wrap">
          <div className="Survey-feedback-about">Additional information you'd like to provide? (optional)</div>
          <textarea
            className="Common-text-field Survey-feedback"
            name="feedback"
            value={feedback}
            onChange={onUpdateFeedback}
            placeholder=""
          />
        </div>
        <div
          className={`Common-button Survey-send-button ${buttonDisabledClass}`}
          onClick={() => onSurveySubmit(survey, response)}
        >
          Submit Opinion
        </div>
      </div>
    );
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

  return (
    <div className="Survey">
      <div className="Survey-about-wrap">
        <div className="Survey-about-title">What do you think?</div>
        <div className="Survey-about-text">
          Your responses here are totally anonymous, so take your time and answer honestly. These questions are intended
          to be fun and thought-provoking. I'll periodically add new surveys, so if you enjoy these, feel free to check
          back later.
        </div>
      </div>
      {getSurveyElement()}
    </div>
  );
}
