import { ActionLink } from "../widgets/ActionLink";
import InfoIcon from "../widgets/InfoIcon";
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
    <div className="md:px-[150px] px-8">
      {project && (
        <div>
          <div className="pb-5 px-5">
            <div className="text-text-1 mb-2 font-noto font-bold text-2xl">{project.name}</div>
            <div className="font-raleway text-text-1 mb-2">{formatDate(project.date)}</div>
            <div className="font-raleway text-text-1 mb-2 ProjectInfo-description">{project.description}</div>
            {project.download_link && <DownloadLink project={project} onDownload={props.onProjectDownload} />}
            {project.web_link && <ProjectInfoLink text="Live demo" link={project.web_link} />}
            {project.source_link && <ProjectInfoLink text="Source code" link={project.source_link} />}
          </div>
          <div>
            {project.image_links.length > 0 &&
              project.image_links.map((imageLink, i) => <ProjectImage key={i} url={imageLink} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectImage(props: { url: string }) {
  return (
    <img
      className="inline-block max-h-[300px] m-3 max-w-[90%] shadow-[0_0_6px_2px_rgba(0,0,0,0.3)]"
      src={props.url}
      key={props.url}
      alt="Project screenshot"
    />
  );
}

function ProjectInfoLink(props: { text: string; link: string }) {
  return (
    <div className="font-raleway text-text-1 mb-2">
      <SimpleLink text={props.text} link={props.link} />
    </div>
  );
}

function DownloadLink(props: { project: ProjectModel; onDownload: (project: ProjectModel) => void }) {
  const isJava = props.project.primary_language === "Java";
  return (
    <div className="font-raleway text-text-1 mb-2">
      <ActionLink
        text={isJava ? "Download Java runnable archive" : "Download project"}
        onClick={() => props.onDownload(props.project)}
      />
      {isJava && <InfoIcon text="Requires a Java installation to run" />}
    </div>
  );
}
