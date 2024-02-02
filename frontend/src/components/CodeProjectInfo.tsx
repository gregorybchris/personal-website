import {
  Coffee,
  DownloadSimple,
  GithubLogo,
  Play,
} from "@phosphor-icons/react";

import { ActionLink } from "../widgets/ActionLink";
import { Project as ProjectModel } from "../models/projectsModels";
import { SimpleLink } from "../widgets/SimpleLink";
import { formatDate } from "../utilities/datetimeUtilities";

interface CodeProjectInfoProps {
  currentProject: ProjectModel | null;
  onProjectDownload: (project: ProjectModel) => void;
}

export function CodeProjectInfo(props: CodeProjectInfoProps) {
  const project = props.currentProject;

  return (
    <div className="px-8 md:px-[150px]">
      {project && (
        <div>
          <div className="px-5 pb-5">
            <div className="mb-2 font-noto text-2xl font-bold text-text-1">
              {project.name}
            </div>
            <div className="mb-2 font-raleway text-text-1">
              {formatDate(project.date)}
            </div>
            <div className="ProjectInfo-description mb-2 font-raleway text-text-1">
              {project.description}
            </div>
            {project.download_link && (
              <DownloadLink
                project={project}
                onDownload={props.onProjectDownload}
              />
            )}
            {project.web_link && (
              <ProjectInfoLink
                text="Live demo"
                link={project.web_link}
                kind="demo"
              />
            )}
            {project.source_link && (
              <ProjectInfoLink
                text="Source code"
                link={project.source_link}
                kind="source"
              />
            )}
          </div>
          <div>
            {project.image_links.length > 0 &&
              project.image_links.map((imageLink, i) => (
                <ProjectImage key={i} url={imageLink} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectImage(props: { url: string }) {
  return (
    <img
      className="m-3 inline-block max-h-[300px] max-w-[90%] shadow-[0_0_6px_2px_rgba(0,0,0,0.3)]"
      src={props.url}
      key={props.url}
      alt="Project screenshot"
    />
  );
}

interface ProjectInfoLinkProps {
  text: string;
  link: string;
  kind: "source" | "demo";
}

function ProjectInfoLink({ text, link, kind }: ProjectInfoLinkProps) {
  return (
    <div className="mb-1 flex flex-row items-center space-x-2">
      {kind === "source" ? (
        <GithubLogo size={25} weight="duotone" color="#6283c0" />
      ) : (
        <Play size={25} weight="duotone" color="#6283c0" />
      )}
      <div className="text-text-1">
        <SimpleLink text={text} link={link} />
      </div>
    </div>
  );
}

interface DownloadLinkProps {
  project: ProjectModel;
  onDownload: (project: ProjectModel) => void;
}

function DownloadLink({ project, onDownload }: DownloadLinkProps) {
  const isJava = project.primary_language === "Java";
  return (
    <div className="mb-1 flex flex-row items-center space-x-2">
      {isJava ? (
        <Coffee size={25} weight="duotone" color="#6283c0" />
      ) : (
        <DownloadSimple size={25} weight="duotone" color="#6283c0" />
      )}

      <div className="text-text-1">
        <ActionLink text="Download" onClick={() => onDownload(project)} />
      </div>
    </div>
  );
}
