import React from "react";

import Response from "./models/Response";
import Question from "./Question";
import { makeQuery, GET, POST } from "../../utilities/RequestUtilities";
import SurveyModel from "./models/Survey";
import "./styles/Survey.sass";

interface SurveyProps {}

interface SurveyState {
  surveys: SurveyModel[];
  current: SurveyModel | null;
  response: Response | null;
}

class Survey extends React.Component<SurveyProps, SurveyState> {
  state: SurveyState = {
    surveys: [],
    current: null,
    response: null,
  };

  async componentDidMount() {
    const surveysQuery = makeQuery("surveys");
    let surveys: SurveyModel[] = await GET(surveysQuery);
    surveys = surveys.reverse().filter((survey) => !survey.archived);
    if (surveys.length > 0) {
      // TODO: Update based on local storage survey completion
      let current = surveys[0];
      let response = Response.fromSurvey(current);
      this.setState({
        surveys: surveys,
        current: current,
        response: response,
      });
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
            No more surveys to complete!
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
        <div
          className={`Common-button Survey-send-button ${buttonDisabledClass}`}
          onClick={() => this.onSurveySubmit(survey, response)}
        >
          Submit
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
    console.log(`Updated response: ${this.state.response}`);
  };

  onSurveySubmit = async (survey: SurveyModel, response: Response) => {
    if (response.isSurveyComplete()) {
      const surveyId = survey.survey_id;
      console.log(`Submitting survey ${surveyId} (${survey.name})`);
      console.log(`Response ${response}`);
      const postSurveyQuery = makeQuery(`surveys/${surveyId}`);
      const queryResult = await POST(postSurveyQuery);
      console.log("Result: ", queryResult);
    }
  };

  render() {
    return (
      <div className="Survey">
        <div className="Survey-about-wrap">
          <div className="Survey-about-title">What do you think?</div>
          <div className="Survey-about-text">
            Do you ever get so curious about something you wish you could poll
            the whole world? While guaranteed to fail, I thought I'd try that
            here. Please check back periodically for new topics. My sincere
            thanks for taking the time to give your opinion.
          </div>
        </div>
        {this.getSurveyElement()}
      </div>
    );
  }
}

export default Survey;
