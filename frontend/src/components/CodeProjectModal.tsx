import * as Dialog from "@radix-ui/react-dialog";

import {
  Coffee,
  DownloadSimple,
  GithubLogo,
  Play,
} from "@phosphor-icons/react";
import { Project, Project as ProjectModel } from "../models/projectsModels";

import { X as CloseIcon } from "@phosphor-icons/react";
import { formatDate } from "../utilities/datetimeUtilities";
import { ActionLink } from "../widgets/ActionLink";
import { SimpleLink } from "../widgets/SimpleLink";

interface CodeProjectModalProps {
  project: Project;
  open: boolean;
  onDownload: (project: Project) => void;
  onClose: () => void;
}

export function CodeProjectModal({
  project,
  open,
  onClose,
  onDownload,
}: CodeProjectModalProps) {
  function onModalOpenChange(open: boolean) {
    if (!open) {
      onClose();
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onModalOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] block h-[90vh] max-h-[90vh] w-[90vw] max-w-[90vw] translate-x-[-50%] translate-y-[-50%] overflow-auto rounded-lg bg-white p-10 shadow-lg md:w-[60vw]">
          <Dialog.Title className="font-noto text-2xl font-bold text-text-1">
            {project.name}
          </Dialog.Title>

          <Dialog.Description className="text-md mb-5 mt-2 font-raleway text-text-1">
            {formatDate(project.date)}
          </Dialog.Description>

          <div className="">
            <Dialog.Description className="text-md mb-5 mt-2 font-raleway text-text-1">
              {project.description}
            </Dialog.Description>

            <div>
              {project.download_link && (
                <DownloadLink project={project} onDownload={onDownload} />
              )}
              {project.web_link && (
                <ProjectInfoLink
                  text="Try it!"
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

            {project.image_links.length > 0 && (
              <>
                <div className="my-5 border-b border-accent"></div>

                <div className="flex flex-wrap">
                  {project.image_links.map((imageLink, i) => (
                    <ProjectImage key={i} url={imageLink} />
                  ))}
                </div>
              </>
            )}
          </div>

          <Dialog.Close asChild>
            <button className="absolute right-5 top-5 flex size-10 items-center justify-center rounded-full outline-none transition-all hover:bg-background-highlight">
              <CloseIcon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ProjectImage(props: { url: string }) {
  return (
    <img
      className="m-1 max-h-[270px] max-w-[90%] border-2 border-background-dark"
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
    <div className="mb-1 flex flex-row">
      <SimpleLink link={link} className="flex flex-row items-center space-x-2">
        {kind === "source" ? (
          <GithubLogo size={25} weight="duotone" color="#6283c0" />
        ) : (
          <Play size={25} weight="duotone" color="#6283c0" />
        )}
        <div>{text}</div>
      </SimpleLink>
    </div>
  );
}

interface DownloadLinkProps {
  project: ProjectModel;
  onDownload: (project: ProjectModel) => void;
}

function DownloadLink({ project, onDownload }: DownloadLinkProps) {
  const isJava = project.primary_language === "Java";
  const text = isJava ? "Download JAR" : "Download";
  return (
    <div className="mb-1 flex flex-row">
      <ActionLink
        onClick={() => onDownload(project)}
        className="flex flex-row items-center space-x-2"
      >
        {isJava ? (
          <Coffee size={25} weight="duotone" color="#6283c0" />
        ) : (
          <DownloadSimple size={25} weight="duotone" color="#6283c0" />
        )}
        <div>{text}</div>
      </ActionLink>
    </div>
  );
}
