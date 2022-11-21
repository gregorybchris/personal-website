import "./styles/ProjectInfo.sass";

import InfoIcon from "../Common/InfoIcon";
import ProjectModel from "./models/Project";
import { formatDate } from "../../utilities/datetimeUtilities";

interface ProjectInfoProps {
  currentProject: ProjectModel | null;
  onProjectDownload: (project: ProjectModel, downloadLink: string) => void;
}

export default function ProjectInfo(props: ProjectInfoProps) {
  const project = props.currentProject;

  return (
    <div className="ProjectInfo">
      {project && (
        <div className="ProjectInfo-content">
          <div className="ProjectInfo-text">
            <div className="ProjectInfo-item ProjectInfo-name">{project.name}</div>
            <div className="ProjectInfo-item">{formatDate(project.date)}</div>
            <div className="ProjectInfo-item ProjectInfo-description">{project.description}</div>
            {project.download_link && (
              <DownloadLink project={project} onDownload={props.onProjectDownload} url={project.download_link} />
            )}
            {project.web_link && <ProjectInfoLink text="Live demo" link={project.web_link} />}
            {project.source_link && <ProjectInfoLink text="Source code" link={project.source_link} />}
          </div>
          <div className="ProjectInfo-images">
            {project.image_links.length === 0 && <div className="ProjectInfo-item">[no images available]</div>}
            {project.image_links.length !== 0 &&
              project.image_links.map((imageLink) => <ProjectImage url={imageLink} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectImage(props: { url: string }) {
  return <img className="ProjectInfo-image" src={props.url} key={props.url} alt="Project screenshot" />;
}

function ProjectInfoLink(props: { text: string; link: string }) {
  return (
    <div className="ProjectInfo-item">
      <a className="Common-simple-link" href={props.link} target="_blank" rel="noopener noreferrer">
        {props.text}
      </a>
    </div>
  );
}

function DownloadLink(props: {
  url: string;
  project: ProjectModel;
  onDownload: (project: ProjectModel, downloadLink: string) => void;
}) {
  const isJava = props.project.primary_language === "Java";
  return (
    <div className="ProjectInfo-item">
      <span className="Common-simple-link" onClick={() => props.onDownload(props.project, props.url)}>
        {isJava ? "Download Java runnable archive" : "Download project"}
      </span>
      {isJava && <InfoIcon text="Requires a Java installation to run." />}
    </div>
  );
}
