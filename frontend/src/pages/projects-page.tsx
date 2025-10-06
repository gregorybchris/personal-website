import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "../components/loader";
import { PageTitle } from "../components/page-title";
import { ProjectModal } from "../components/project-modal";
import { ProjectsTimeline } from "../components/projects-timeline";
import { SearchBar } from "../components/search-bar";
import { GET, POST, makeQuery } from "../utilities/request-utilities";

export interface Project {
  project_id: string;
  name: string;
  slug: string;
  date: string;
  rating: number;
  project_type: string;
  controls: string | null;
  description: string | null;
  remarks: string | null;
  source_link: string | null;
  download_link: string | null;
  web_link: string | null;
  original_link: string | null;
  image_links: string[];
  primary_language: string;
  archived: boolean;
}

export function ProjectsPage() {
  const downloadAnchor = useRef<HTMLAnchorElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { slug } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    const projectsQuery = makeQuery("projects");
    GET(projectsQuery).then((queryResult) => {
      const projects = queryResult.reverse();
      setProjects(projects);

      if (slug) {
        for (let project of projects) {
          if (project.slug === slug) {
            setCurrentProject(project);
          }
        }
      }
    });
  }, []);

  function onDownload(project: Project) {
    if (!project.download_link) {
      console.error("No download link exists for project: ", project);
      return;
    }

    const anchorCurrent = downloadAnchor.current;
    if (!anchorCurrent) {
      console.error("Download ref was not ready");
      return;
    }

    anchorCurrent.click();
    POST(makeQuery(`projects/download/${project.project_id}`));
  }

  function onSelectProject(project: Project | null) {
    if (project === null) {
      navigate("/projects");
    } else {
      navigate(`/projects/${project.slug}`);
    }
    setCurrentProject(project);
  }

  return (
    <div className="py-8">
      <div
        onClick={() => {
          if (searchEnabled) {
            setSearchText("");
          }
          setSearchEnabled(!searchEnabled);
        }}
      >
        <PageTitle>Code &amp; Programming Projects</PageTitle>
      </div>

      {projects.length === 0 ? (
        <Loader className="mt-8">Loading projects...</Loader>
      ) : (
        <ProjectsTimeline
          projects={projects}
          currentProject={currentProject}
          onSelectProject={onSelectProject}
          searchText={searchText}
        />
      )}

      {searchEnabled && (
        <div className="flex flex-col items-center justify-center gap-5 p-5">
          <SearchBar
            text={searchText}
            setText={setSearchText}
            autoFocus={true}
            className="w-[90%] max-w-[400px]"
          />
        </div>
      )}

      {currentProject && (
        <ProjectModal
          project={currentProject}
          open={!!currentProject}
          onClose={() => onSelectProject(null)}
          onDownload={onDownload}
        />
      )}
      {currentProject?.download_link && (
        <a
          className="opacity-0"
          ref={downloadAnchor}
          href={currentProject?.download_link}
          target="_blank"
          rel="noopener noreferrer"
        >
          Hidden
        </a>
      )}
    </div>
  );
}
