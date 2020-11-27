import React from "react";

import "./Survey.sass";
import SurveyQuestion from "./SurveyQuestion";
import { makeQuery, GET, POST } from "../../controllers/RequestUtilities";
import SurveyRecord from "../../models/SurveyRecord";

export interface SurveyProps {}

export interface SurveyState {
  surveys: SurveyRecord[];
  currentSurvey: SurveyRecord | null;
}

class Survey extends React.Component<SurveyProps, SurveyState> {
  state = {
    surveys: [],
    currentSurvey: null,
  };

  async componentDidMount() {
    const surveysQuery = makeQuery("surveys");
    const queryResult = await GET(surveysQuery);
    this.setState({ surveys: queryResult.reverse() });
    this.setState({ currentSurvey: this.state.surveys[0] });
  }

  getSurveyElement = (survey: SurveyRecord | null) => {
    if (survey == null) {
      return undefined;
    } else {
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
              ></SurveyQuestion>
            ))}
          </div>
        </div>
      );
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
        {this.getSurveyElement(this.state.currentSurvey)}
      </div>
    );
  }
}

export default Survey;
