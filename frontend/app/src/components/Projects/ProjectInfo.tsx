import React from "react";

import ProjectModel from "./models/Project";
import { formatDate } from "../../utilities/DateTimeUtilities";

import "./styles/ProjectInfo.sass";

export interface ProjectInfoProps {
  currentProject: ProjectModel | null;
  onProjectDownload: (project: ProjectModel, downloadLink: string) => void;
}

export interface ProjectInfoState {}

class ProjectInfo extends React.Component<ProjectInfoProps, ProjectInfoState> {
  state = {};

  componentDidMount() {}

  createImageElement = (link: string) => {
    return (
      <img
        className="ProjectInfo-image"
        src={link}
        key={link}
        alt="Project screenshot"
      ></img>
    );
  };

  createProjectInfo = (project: ProjectModel) => {
    if (project === null) {
      return;
    }
    const formattedDate = formatDate(project.date);
    const imageElements =
      project.image_links.length === 0 ? (
        <div className="ProjectInfo-item">[no images available]</div>
      ) : (
        project.image_links.map(this.createImageElement)
      );
    const downloadLink =
      project.download_link === null ? "" : project.download_link;
    const downloadLinkElement = downloadLink ? (
      <div className="ProjectInfo-item">
        <span
          className="Common-simple-link"
          onClick={() => this.props.onProjectDownload(project, downloadLink)}
        >
          Download
        </span>
      </div>
    ) : undefined;

    const codeLink = project.code_link === null ? "" : project.code_link;
    const codeLinkElement = codeLink ? (
      <div className="ProjectInfo-item">
        <span
          className="Common-simple-link"
          onClick={() => this.props.onProjectDownload(project, codeLink)}
        >
          Source Code
        </span>
      </div>
    ) : undefined;

    return (
      <div className="ProjectInfo-content">
        <div className="ProjectInfo-text">
          <div className="ProjectInfo-item ProjectInfo-name">
            {project.name}
          </div>
          <div className="ProjectInfo-item">{formattedDate}</div>
          <div className="ProjectInfo-item">
            Language: {project.primary_language}
          </div>
          {downloadLinkElement}
          {codeLinkElement}
          <div className="ProjectInfo-item ProjectInfo-description">
            {project.description}
          </div>
        </div>
        <div className="ProjectInfo-images">{imageElements}</div>
      </div>
    );
  };

  render() {
    let infoContent =
      this.props.currentProject == null
        ? undefined
        : this.createProjectInfo(this.props.currentProject);
    return <div className="ProjectInfo">{infoContent}</div>;
  }
}

export default ProjectInfo;
