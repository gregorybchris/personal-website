import React from "react";

import ProjectTimeline from "./ProjectTimeline";
import ProjectRecord from "../models/ProjectRecord";
import { makeQuery, GET } from "../controllers/RequestUtilities";
import "./Bio.css";

export interface BioProps {}

export interface BioState {
  projects: ProjectRecord[];
}

class Bio extends React.Component<BioProps, BioState> {
  state = {
    projects: [],
  };

  async componentDidMount() {
    const postsQuery = makeQuery("projects");
    const queryResult = await GET(postsQuery);
    this.setState({ projects: queryResult["projects"].reverse() });
  }

  render() {
    return (
      <div className="Bio">
        <ProjectTimeline projects={this.state.projects}></ProjectTimeline>
      </div>
    );
  }
}

export default Bio;
