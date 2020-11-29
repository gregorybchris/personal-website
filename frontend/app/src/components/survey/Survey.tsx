import React from "react";

import SurveyResponse from "./models/SurveyResponse";
import SurveyQuestion from "./SurveyQuestion";
import { makeQuery, GET, POST } from "../../utilities/RequestUtilities";
import SurveyRecord from "./models/SurveyRecord";
import "./styles/Survey.sass";

export interface SurveyProps {}

export interface SurveyState {
  surveys: SurveyRecord[];
  response: SurveyResponse | null;
}

class Survey extends React.Component<SurveyProps, SurveyState> {
  state = {
    surveys: [],
    response: null,
  };

  async componentDidMount() {
    const surveysQuery = makeQuery("surveys");
    const queryResult = await GET(surveysQuery);
    this.setState({
      surveys: queryResult
        .reverse()
        .filter((survey: SurveyRecord) => !survey.archived),
    });
  }

  getSurveyElement = () => {
    if (this.state.surveys.length === 0) {
      return (
        <div className="Survey-message-wrap">
          <div className="Survey-message-text">Loading surveys...</div>
        </div>
      );
    } else {
      let currentSurvey: SurveyRecord | null = null;
      for (let i = 0; i < this.state.surveys.length; i++) {
        if (true) {
          currentSurvey = this.state.surveys[i];
          break;
        }
      }

      if (currentSurvey === null) {
        return (
          <div className="Survey-message-wrap">
            <div className="Survey-message-text">
              No more surveys to complete!
            </div>
          </div>
        );
      } else {
        let survey = currentSurvey as SurveyRecord;
        let response = SurveyResponse.fromRecord(survey);
        // this.setState({ response: response });
        return (
          <div className="Survey-content">
            <div className="Survey-name">{survey.name}</div>
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
          </div>
        );
      }
    }
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
