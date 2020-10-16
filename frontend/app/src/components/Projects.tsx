import React from "react";

import ProjectTimeline from "./ProjectTimeline";
import ProjectRecord from "../models/ProjectRecord";
import { makeQuery, GET } from "../controllers/RequestUtilities";
import "./Projects.css";

export interface ProjectsProps {}

export interface ProjectsState {
  projects: ProjectRecord[];
}

class Projects extends React.Component<ProjectsProps, ProjectsState> {
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
      <div className="Projects">
        <ProjectTimeline projects={this.state.projects}></ProjectTimeline>
      </div>
    );
  }
}

export default Projects;
