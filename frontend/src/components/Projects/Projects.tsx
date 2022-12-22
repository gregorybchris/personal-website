import "./styles/Projects.sass";

import { GET, POST, makeQuery } from "../../utilities/requestUtilities";
import { useEffect, useRef, useState } from "react";

import ProjectInfo from "./ProjectInfo";
import ProjectModel from "./models/Project";
import ProjectTimeline from "./ProjectTimeline";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function Projects() {
  const hiddenDownloadAnchor = useRef<HTMLAnchorElement>(null);
  const [projects, setProjects] = useState<ProjectModel[]>([]);
  const [currentProject, setCurrentProject] = useState<ProjectModel | null>(null);
  const [currentDownloadProject, setCurrentDownloadProject] = useState<ProjectModel | null>(null);
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
    <div className="Projects">
      <div className="Projects-title">Code &amp; Programming Projects</div>
      <ProjectTimeline projects={projects} currentProject={currentProject} onSelectProject={onSelectProject} />
      <ProjectInfo currentProject={currentProject} onProjectDownload={onProjectDownload} />
      {currentDownloadProject?.download_link && (
        <a
          className="Projects-hidden-download-link"
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
