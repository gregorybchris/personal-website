import React from "react";
import { match } from "react-router-dom";
import { History } from "history";

import ProjectInfo from "./ProjectInfo";
import ProjectTimeline from "./ProjectTimeline";
import ProjectModel from "./models/Project";
import { makeQuery, GET, POST } from "../../utilities/RequestUtilities";
import "./styles/Projects.sass";

interface ProjectsParams {
  slug: string;
}

interface ProjectsProps {
  match?: match<ProjectsParams>;
  history?: History;
}

interface ProjectsState {
  projects: ProjectModel[];
  currentProject: ProjectModel | null;
  currentDownloadLink: string;
}

class Projects extends React.Component<ProjectsProps, ProjectsState> {
  private hiddenDownloadAnchor: React.RefObject<HTMLAnchorElement>;
  state: ProjectsState = {
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
    const projects = queryResult.reverse();
    this.setState({ projects: projects });

    const match = this.props.match;
    if (match) {
      const { slug } = match.params;
      if (slug) {
        for (let project of projects) {
          if (project.slug === slug) {
            this.setState({ currentProject: project });
          }
        }
      }
    }
  }

  onProjectDownload = async (project: ProjectModel, link: string) => {
    this.setState({ currentDownloadLink: link }, () => {
      if (this.hiddenDownloadAnchor && this.hiddenDownloadAnchor.current) {
        this.hiddenDownloadAnchor.current.click();
      }
    });

    await POST(makeQuery(`projects/download/${project.project_id}`));
  };

  onSelectProject = (project: ProjectModel | null) => {
    const history = this.props.history;
    if (history) {
      if (project === null) {
        history.push("/code");
      } else {
        history.push(`/code/${project.slug}`);
      }
    }
    this.setState({ currentProject: project });
  };

  render() {
    return (
      <div className="Projects">
        <div className="Projects-title">Code &amp; Programming Projects</div>
        <ProjectTimeline
          projects={this.state.projects}
          currentProject={this.state.currentProject}
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
          rel="noopener noreferrer"
        >
          Hidden
        </a>
      </div>
    );
  }
}

export default Projects;
