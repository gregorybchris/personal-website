import React from "react";

import Response from "./models/Response";
import Question from "./Question";
import { makeQuery, GET, POST } from "../../utilities/RequestUtilities";
import { STORE } from "../../utilities/StorageUtilities";
import SurveyModel from "./models/Survey";
import "./styles/Survey.sass";

interface SurveyProps {}

interface SurveyState {
  surveys: SurveyModel[];
  current: SurveyModel | null;
  response: Response | null;
  feedback: string;
}

class Survey extends React.Component<SurveyProps, SurveyState> {
  static COMPLETED_KEY = "completed-surveys";

  state: SurveyState = {
    surveys: [],
    current: null,
    response: null,
    feedback: "",
  };

  async componentDidMount() {
    const surveysQuery = makeQuery("surveys");
    let surveys: SurveyModel[] = await GET(surveysQuery);
    surveys = surveys.filter((survey) => !survey.archived);
    this.setState({ surveys: surveys });
    if (!STORE.contains(Survey.COMPLETED_KEY)) {
      STORE.set(Survey.COMPLETED_KEY, []);
    }
    this.setCurrentSurvey();
  }

  setCurrentSurvey() {
    if (this.state.surveys.length > 0) {
      const completedIds: Array<string> = STORE.get(Survey.COMPLETED_KEY);
      const surveys = this.state.surveys;
      let current: SurveyModel | null = null;
      for (let i = 0; i < surveys.length; i++) {
        if (!completedIds.includes(surveys[i].survey_id)) {
          current = surveys[i];
        }
      }

      if (current === null) {
        this.setState({
          current: null,
          response: null,
          feedback: "",
        });
      } else {
        this.setState({
          current: current,
          response: Response.fromSurvey(current),
          feedback: "",
        });
      }
    }
  }

  getSurveyElement = () => {
    if (this.state.surveys.length === 0) {
      return (
        <div className="Survey-message-wrap">
          <div className="Survey-message-text">Loading surveys...</div>
        </div>
      );
    }

    if (this.state.current === null || this.state.response == null) {
      return (
        <div className="Survey-message-wrap">
          <div className="Survey-message-text">
            No more surveys to complete
            <span onClick={this.onClearCompletedCache}>!</span>
          </div>
        </div>
      );
    }

    const survey = this.state.current;
    const response = this.state.response;
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
              onOptionClicked={this.onOptionClicked}
              response={response}
            ></Question>
          ))}
        </div>
        <div className="Survey-feedback-wrap">
          <div className="Survey-feedback-about">Additional information you'd like to provide? (optional)</div>
          <textarea
            className="Common-text-field Survey-feedback"
            name="feedback"
            value={this.state.feedback}
            onChange={this.onUpdateFeedback}
            placeholder=""
          />
        </div>
        <div
          className={`Common-button Survey-send-button ${buttonDisabledClass}`}
          onClick={() => this.onSurveySubmit(survey, response)}
        >
          Submit Opinion
        </div>
      </div>
    );
  };

  onOptionClicked = async (question: number, option: number) => {
    if (this.state.response !== null) {
      const chosen = this.state.response.isOptionChosen(question, option);
      this.state.response?.updateOptionChoice(question, option, !chosen);
    }
    this.setState({ response: this.state.response });
  };

  onSurveySubmit = async (survey: SurveyModel, response: Response) => {
    if (response.isSurveyComplete()) {
      const surveyId = survey.survey_id;
      const postSurveyQuery = makeQuery(`surveys/${surveyId}`);
      const postBody = {
        choices: response.choices,
        feedback: this.state.feedback,
      };
      const queryResult = await POST(postSurveyQuery, postBody);
      const completedIds = STORE.get(Survey.COMPLETED_KEY);
      completedIds.push(surveyId);
      STORE.set(Survey.COMPLETED_KEY, completedIds, true);
      this.setCurrentSurvey();
    }
  };

  onClearCompletedCache = () => {
    STORE.set(Survey.COMPLETED_KEY, [], true);
    this.setCurrentSurvey();
  };

  onUpdateFeedback = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ feedback: event.target.value });
  };

  render() {
    return (
      <div className="Survey">
        <div className="Survey-about-wrap">
          <div className="Survey-about-title">What do you think?</div>
          <div className="Survey-about-text">
            Your responses here are totally anonymous, so take your time and answer honestly. These questions are
            intended to be fun and thought-provoking. I'll periodically add new surveys, so if you enjoy these, feel
            free to check back later.
          </div>
        </div>
        {this.getSurveyElement()}
      </div>
    );
  }
}

export default Survey;
