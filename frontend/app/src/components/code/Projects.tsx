import React from "react";

import ProjectInfo from "./ProjectInfo";
import ProjectTimeline from "./ProjectTimeline";
import ProjectRecord from "../../models/ProjectRecord";
import { makeQuery, GET, POST } from "../../controllers/RequestUtilities";
import "./Projects.sass";

export interface ProjectsProps {}

export interface ProjectsState {
  projects: ProjectRecord[];
  currentProject: ProjectRecord | null;
  currentDownloadLink: string;
}

class Projects extends React.Component<ProjectsProps, ProjectsState> {
  private hiddenDownloadAnchor: React.RefObject<HTMLAnchorElement>;
  state = {
    projects: [],
    currentProject: null,
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

  onSelectProject = (project: ProjectRecord) => {
    this.setState({ currentProject: project });
  };

  render() {
    return (
      <div className="Projects">
        <ProjectTimeline
          projects={this.state.projects}
          onSelectProject={this.onSelectProject}
        ></ProjectTimeline>
        <ProjectInfo
          currentProject={this.state.currentProject}
          onProjectDownload={this.onProjectDownload}
        ></ProjectInfo>
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
