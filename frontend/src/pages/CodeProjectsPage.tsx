import { GET, POST, makeQuery } from "../utilities/requestUtilities";
import { useEffect, useRef, useState } from "react";

import { CodeProjectInfo } from "../components/CodeProjectInfo";
import { CodeProjectsTimeline } from "../components/CodeProjectsTimeline";
import { Project as ProjectModel } from "../models/projectsModels";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export function CodeProjectsPage() {
  const hiddenDownloadAnchor = useRef<HTMLAnchorElement>(null);
  const [projects, setProjects] = useState<ProjectModel[]>([]);
  const [currentProject, setCurrentProject] = useState<ProjectModel | null>(
    null,
  );
  const [currentDownloadProject, setCurrentDownloadProject] =
    useState<ProjectModel | null>(null);
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

  function onProjectDownload(project: ProjectModel) {
    if (!project.download_link) {
      console.error("No download link exists for project: ", project);
      return;
    }
    setCurrentDownloadProject(project);
  }

  useEffect(() => {
    if (!currentDownloadProject) return;

    const anchorCurrent = hiddenDownloadAnchor.current;
    if (anchorCurrent) {
      anchorCurrent.click();
    }
    POST(makeQuery(`projects/download/${currentDownloadProject.project_id}`));
  }, [currentDownloadProject]);

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
      <div className="mt-8 block text-center font-noto text-2xl font-bold text-text-1 md:text-3xl">
        Code &amp; Programming Projects
      </div>
      <CodeProjectsTimeline
        projects={projects}
        currentProject={currentProject}
        onSelectProject={onSelectProject}
      />
      <CodeProjectInfo
        currentProject={currentProject}
        onProjectDownload={onProjectDownload}
      />
      {currentDownloadProject?.download_link && (
        <a
          className="opacity-0"
          ref={hiddenDownloadAnchor}
          href={currentDownloadProject?.download_link}
          target="_blank"
          rel="noopener noreferrer"
        >
          Hidden
        </a>
      )}
    </div>
  );
}
