import React from "react";

import InfoIcon from "../Common/InfoIcon";
import ProjectModel from "./models/Project";
import { formatDate } from "../../utilities/DateTimeUtilities";

import "./styles/ProjectInfo.sass";

interface ProjectInfoProps {
  currentProject: ProjectModel | null;
  onProjectDownload: (project: ProjectModel, downloadLink: string) => void;
}

interface ProjectInfoState {}

class ProjectInfo extends React.Component<ProjectInfoProps, ProjectInfoState> {
  createImageElement = (link: string) => {
    return <img className="ProjectInfo-image" src={link} key={link} alt="Project screenshot"></img>;
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

    let downloadLinkElement = <></>;
    const downloadLink = project.download_link;
    if (downloadLink !== null) {
      const language = project.primary_language;
      const buttonText = language == "Java" ? "Download Java runnable archive" : "Download project";
      downloadLinkElement = (
        <div className="ProjectInfo-item">
          <span className="Common-simple-link" onClick={() => this.props.onProjectDownload(project, downloadLink)}>
            {buttonText}
          </span>
          <InfoIcon text="Your computer might not be able to run this older JAR file."></InfoIcon>
        </div>
      );
    }

    return (
      <div className="ProjectInfo-content">
        <div className="ProjectInfo-text">
          <div className="ProjectInfo-item ProjectInfo-name">{project.name}</div>
          <div className="ProjectInfo-item">{formattedDate}</div>
          <div className="ProjectInfo-item ProjectInfo-description">{project.description}</div>
          {downloadLinkElement}
          <ProjectInfoLink text="Source code" link={project.source_link}></ProjectInfoLink>
          <ProjectInfoLink text="Project demo" link={project.web_link}></ProjectInfoLink>
        </div>
        <div className="ProjectInfo-images">{imageElements}</div>
      </div>
    );
  };

  render() {
    let infoContent = this.props.currentProject == null ? undefined : this.createProjectInfo(this.props.currentProject);
    return <div className="ProjectInfo">{infoContent}</div>;
  }
}

interface ProjectInfoLinkProps {
  text: string;
  link: string | null;
}

const ProjectInfoLink = (props: ProjectInfoLinkProps) => {
  let link = props.link;
  if (link === null) {
    return <></>;
  }

  return (
    <div className="ProjectInfo-item">
      <a className="Common-simple-link" href={link} target="_blank" rel="noopener noreferrer">
        {props.text}
      </a>
    </div>
  );
};

export default ProjectInfo;
