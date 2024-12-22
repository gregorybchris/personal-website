import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GET, POST, makeQuery } from "../utilities/requestUtilities";

import { CodeProjectModal } from "../components/CodeProjectModal";
import { CodeProjectsTimeline } from "../components/CodeProjectsTimeline";
import { Project as ProjectModel } from "../models/projectsModels";

export function CodeProjectsPage() {
  const downloadAnchor = useRef<HTMLAnchorElement>(null);
  const [projects, setProjects] = useState<ProjectModel[]>([]);
  const [currentProject, setCurrentProject] = useState<ProjectModel | null>(
    null,
  );
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

  function onDownload(project: ProjectModel) {
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

  function onSelectProject(project: ProjectModel | null) {
    if (project === null) {
      navigate("/code");
    } else {
      navigate(`/code/${project.slug}`);
    }
    setCurrentProject(project);
  }

  return (
    <div className="bg-background">
      <div
        className="mt-8 block text-center font-noto text-2xl font-bold text-text-1 md:text-3xl"
        onClick={() => {
          if (searchEnabled) {
            setSearchText("");
          }
          setSearchEnabled(!searchEnabled);
        }}
      >
        Code &amp; Programming Projects
      </div>

      <CodeProjectsTimeline
        projects={projects}
        currentProject={currentProject}
        onSelectProject={onSelectProject}
        searchText={searchText}
      />

      {searchEnabled && (
        <div className="flex flex-col items-center justify-center gap-5 p-5">
          <input
            className="Common-text-field w-[300px]"
            type="text"
            name="searchText"
            placeholder="Search"
            autoComplete="off"
            maxLength={50}
            required
            autoFocus
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      )}

      {currentProject && (
        <CodeProjectModal
          project={currentProject}
          open={!!currentProject}
          onClose={() => onSelectProject(null)}
          onDownload={onDownload}
        />
        // <CodeProjectInfo project={currentProject} onDownload={onDownload} />
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
