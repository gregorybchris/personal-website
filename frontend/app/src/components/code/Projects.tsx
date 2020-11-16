import React from "react";

import ProjectTimeline from "./ProjectTimeline";
import ProjectRecord from "../../models/ProjectRecord";
import { makeQuery, GET, POST } from "../../controllers/RequestUtilities";
import "./Projects.css";

export interface ProjectsProps {}

export interface ProjectsState {
  projects: ProjectRecord[];
  currentDownloadLink: string;
}

class Projects extends React.Component<ProjectsProps, ProjectsState> {
  private hiddenDownloadAnchor: React.RefObject<HTMLAnchorElement>;
  state = {
    projects: [],
    currentDownloadLink: "",
  };

  constructor(props: ProjectsProps) {
    super(props);
    this.hiddenDownloadAnchor = React.createRef();
  }

  async componentDidMount() {
    const projectsQuery = makeQuery("projects");
    const queryResult = await GET(projectsQuery);
    this.setState({ projects: queryResult.reverse() });
  }

  onProjectDownload = async (project: ProjectRecord, link: string) => {
    this.setState({ currentDownloadLink: link }, () => {
      if (this.hiddenDownloadAnchor && this.hiddenDownloadAnchor.current) {
        this.hiddenDownloadAnchor.current.click();
      }
    });

    await POST(makeQuery(`projects/download/${project.project_id}`));
  };

  render() {
    return (
      <div className="Projects">
        <ProjectTimeline
          projects={this.state.projects}
          onProjectDownload={this.onProjectDownload}
        ></ProjectTimeline>
        <a
          className="Projects-hidden-download-link"
          ref={this.hiddenDownloadAnchor}
          href={this.state.currentDownloadLink}
          target="_blank"
        />
      </div>
    );
  }
}

export default Projects;
