import {
  X as CloseIcon,
  Coffee,
  DownloadSimple,
  GithubLogo,
  Lightbulb,
  Play,
} from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import { Project } from "../pages/projects-page";
import { formatDate } from "../utilities/datetime-utilities";
import { ActionLink } from "./action-link";
import { SimpleLink } from "./simple-link";

interface ProjectModalProps {
  project: Project;
  open: boolean;
  onDownload: (project: Project) => void;
  onClose: () => void;
}

export function ProjectModal({
  project,
  open,
  onClose,
  onDownload,
}: ProjectModalProps) {
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
          <Dialog.Title className="font-sanchez text-2xl text-black/75">
            {project.name}
          </Dialog.Title>

          <div className="font-raleway">
            <Dialog.Description className="text-md mb-5 mt-2 text-black/75">
              {formatDate(project.date)}
            </Dialog.Description>

            <Dialog.Description className="text-md mb-5 mt-2 text-black/75">
              {project.description}
            </Dialog.Description>

            <div className="flex flex-col space-y-2">
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
              {project.original_link && (
                <ProjectInfoLink
                  text="Original"
                  link={project.original_link}
                  kind="original"
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
            <button className="absolute right-5 top-5 flex size-10 items-center justify-center rounded-full outline-none transition-all hover:bg-black/5">
              <CloseIcon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

interface ProjectImageProps {
  url: string;
}

function ProjectImage({ url }: ProjectImageProps) {
  return (
    <img
      className="m-1 max-h-[270px] max-w-[90%] border-2 border-neutral-300"
      src={url}
      key={url}
      alt="Project screenshot"
    />
  );
}

interface ProjectInfoLinkProps {
  text: string;
  link: string;
  kind: "source" | "demo" | "original";
}

function ProjectInfoLink({ text, link, kind }: ProjectInfoLinkProps) {
  let logo = null;
  if (kind === "source")
    logo = <GithubLogo size={25} weight="duotone" color="#6283c0" />;
  if (kind === "demo")
    logo = <Play size={25} weight="duotone" color="#6283c0" />;
  if (kind === "original")
    logo = <Lightbulb size={25} weight="duotone" color="#6283c0" />;

  return (
    <div className="flex flex-row">
      <SimpleLink link={link} className="flex flex-row items-center space-x-2">
        {logo}

        <div>{text}</div>
      </SimpleLink>
    </div>
  );
}

interface DownloadLinkProps {
  project: Project;
  onDownload: (project: Project) => void;
}

function DownloadLink({ project, onDownload }: DownloadLinkProps) {
  const isJava = project.primary_language === "Java";
  const text = isJava ? "Download JAR" : "Download";
  return (
    <div className="flex flex-row">
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
