import React from "react";

import SurveyResponse from "./models/SurveyResponse";
import SurveyQuestion from "./SurveyQuestion";
import { makeQuery, GET, POST } from "../../utilities/RequestUtilities";
import SurveyModel from "./models/Survey";
import "./styles/Survey.sass";

interface SurveyProps {}

interface SurveyState {
  surveys: SurveyModel[];
  currentSurvey: SurveyModel | null;
  response: SurveyResponse | null;
}

class Survey extends React.Component<SurveyProps, SurveyState> {
  state: SurveyState = {
    surveys: [],
    currentSurvey: null,
    response: null,
  };

  async componentDidMount() {
    const surveysQuery = makeQuery("surveys");
    let surveys: SurveyModel[] = await GET(surveysQuery);
    surveys = surveys.reverse().filter((survey) => !survey.archived);
    if (surveys.length > 0) {
      // TODO: Update based on local storage survey completion
      let currentSurvey = surveys[0];
      let response = SurveyResponse.fromSurvey(currentSurvey);
      this.setState({
        surveys: surveys,
        currentSurvey: currentSurvey,
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

    if (this.state.currentSurvey === null || this.state.response == null) {
      return (
        <div className="Survey-message-wrap">
          <div className="Survey-message-text">
            No more surveys to complete!
          </div>
        </div>
      );
    }

    let survey = this.state.currentSurvey;
    let response = this.state.response;
    return (
      <div className="Survey-content">
        <div className="Survey-name-wrap">
          <div className="Survey-name">{survey.name}</div>
        </div>
        <div className="Survey-questions">
          {survey.questions.map((question, questionNumber) => (
            <SurveyQuestion
              key={questionNumber}
              surveyId={survey.survey_id}
              question={question}
              questionNumber={questionNumber}
              onOptionClicked={this.onOptionClicked}
              response={response}
            ></SurveyQuestion>
          ))}
        </div>
        <div
          className="Common-button Survey-send-button disabled"
          onClick={() => this.onSurveySubmit(survey, response)}
        >
          Submit
        </div>
      </div>
    );
  };

  onOptionClicked = async (
    surveyId: string,
    questionNumber: number,
    optionNumber: number
  ) => {
    console.log(
      `Clicked option ${optionNumber} of question ${questionNumber} of survey ${surveyId}`
    );
    const postSurveyQuery = makeQuery(`surveys/${surveyId}`);
    const queryResult = await POST(postSurveyQuery);
    console.log("Result: ", queryResult);
  };

  onSurveySubmit = async (survey: SurveyModel, response: SurveyResponse) => {
    console.log(`Submitting survey ${survey.name} with responses ${response}`);
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
