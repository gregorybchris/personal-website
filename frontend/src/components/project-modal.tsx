import {
  CoffeeIcon,
  DownloadSimpleIcon,
  GithubLogoIcon,
  LightbulbIcon,
  PlayIcon,
  XIcon,
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
        <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-black/60" />
        <Dialog.Content className="data-[state=open]:animate-contentShow bg-parchment fixed top-[50%] left-[50%] h-[90vh] max-h-[90vh] w-[90vw] max-w-[90vw] translate-x-[-50%] translate-y-[-50%] overflow-auto rounded-lg shadow-lg md:w-[60vw]">
          <div className="font-raleway text-md flex flex-col">
            <div className="bg-parchment sticky top-0 z-10 flex flex-col gap-3 px-10 pt-10 pb-5">
              <Dialog.Title className="flex flex-col gap-0.5">
                <div className="font-sanchez text-2xl text-black/75">
                  {project.name}
                </div>
                <div className="text-sm text-black/45">
                  {formatDate(project.date)}
                </div>
              </Dialog.Title>

              <Dialog.Close asChild>
                <button className="absolute top-5 right-5 flex size-8 cursor-pointer items-center justify-center rounded-full transition-all outline-none hover:bg-black/5">
                  <XIcon color="#444" />
                </button>
              </Dialog.Close>
            </div>

            {/* Scrollable content */}
            <div className="flex flex-col gap-3 px-10 pb-10">
              <div className="flex flex-col gap-5">
                <Dialog.Description className="text-black/75">
                  {project.description}
                </Dialog.Description>

                <div className="flex flex-col gap-y-1">
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
              </div>

              {project.image_links.length > 0 && (
                <>
                  <div className="my-3 w-full border-b border-black/8"></div>

                  <div className="flex flex-row flex-wrap gap-3">
                    {project.image_links.map((imageLink, i) => (
                      <ProjectImage key={i} url={imageLink} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
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
      className="max-h-[270px] max-w-[90%] rounded-lg border-4 border-black/10 shadow-md"
      src={`${url}?cache=4`}
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
    logo = <GithubLogoIcon size={20} weight="duotone" color="#6283c0" />;
  if (kind === "demo")
    logo = <PlayIcon size={20} weight="duotone" color="#6283c0" />;
  if (kind === "original")
    logo = <LightbulbIcon size={20} weight="duotone" color="#6283c0" />;

  return (
    <div className="flex flex-row">
      <SimpleLink link={link} className="flex flex-row items-center gap-x-2">
        <div>{logo}</div>
        <span>{text}</span>
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
        className="flex flex-row items-center gap-x-2"
      >
        {isJava ? (
          <CoffeeIcon size={20} weight="duotone" color="#6283c0" />
        ) : (
          <DownloadSimpleIcon size={20} weight="duotone" color="#6283c0" />
        )}
        <div>{text}</div>
      </ActionLink>
    </div>
  );
}
