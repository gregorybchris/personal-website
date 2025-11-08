import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorMessage } from "../components/error-message";
import { Loader } from "../components/loader";
import { PageTitle } from "../components/page-title";
import { ProjectModal } from "../components/project-modal";
import { ProjectsTimeline } from "../components/projects-timeline";
import { SearchBar } from "../components/search-bar";
import { GET, POST, makeQuery } from "../utilities/request-utilities";

export interface Project {
  projectId: string;
  name: string;
  slug: string;
  date: string;
  rating: number;
  projectType: string;
  controls: string | null;
  description: string | null;
  remarks: string | null;
  sourceLink: string | null;
  downloadLink: string | null;
  webLink: string | null;
  originalLink: string | null;
  imageLinks: string[];
  primaryLanguage: string;
  archived: boolean;
}

export function ProjectsPage() {
  const downloadAnchor = useRef<HTMLAnchorElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  // Fetch projects once on mount
  useEffect(() => {
    const projectsQuery = makeQuery("projects");
    GET<Project[]>(projectsQuery)
      .then((queryResult) => {
        const projects = queryResult.reverse();
        setProjects(projects);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to load projects:", err);
        setError("Failed to load projects");
      });
  }, []);

  // Update current project when slug changes
  useEffect(() => {
    if (slug && projects.length > 0) {
      const project = projects.find((p) => p.slug === slug);
      setCurrentProject(project || null);
    } else if (!slug) {
      setCurrentProject(null);
    }
  }, [slug, projects]);

  function onDownload(project: Project) {
    if (!project.downloadLink) {
      console.error("No download link exists for project: ", project);
      return;
    }

    const anchorCurrent = downloadAnchor.current;
    if (!anchorCurrent) {
      console.error("Download ref was not ready");
      return;
    }

    anchorCurrent.click();
    POST(makeQuery(`projects/download/${project.projectId}`));
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

      {error ? (
        <ErrorMessage message={error} className="mt-8" />
      ) : projects.length === 0 ? (
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
      {currentProject?.downloadLink && (
        <a
          className="opacity-0"
          ref={downloadAnchor}
          href={currentProject?.downloadLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Hidden
        </a>
      )}
    </div>
  );
}
