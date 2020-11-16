import React from "react";

import * as d3 from "d3";
import random from "random";
import seedrandom from "seedrandom";

import { formatDate } from "../../controllers/DateTimeUtilities";
import ProjectRecord from "../../models/ProjectRecord";
import "./ProjectTimeline.css";

export interface TimelineProps {
  projects: ProjectRecord[];
  onProjectDownload: (project: ProjectRecord, link: string) => void;
}

export interface TimelineState {
  currentProject: ProjectRecord | null;
}

class Timeline extends React.Component<TimelineProps, TimelineState> {
  private canvasRef: React.RefObject<HTMLInputElement>;
  state = { currentProject: null };

  constructor(props: TimelineProps) {
    super(props);
    this.canvasRef = React.createRef();
  }

  populateCanvas = (projects: ProjectRecord[]) => {
    const canvas = d3.select(this.canvasRef.current);

    canvas.on("mousemove", (mouseEvent: any) => {
      console.log(mouseEvent);
    });

    canvas.selectAll("svg").remove();
    const [width, height] = [1000, 200];
    const svg = canvas
      .append("svg")
      .classed("ProjectTimeline-svg", true)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", `0 0 ${width} ${height}`);

    const getProjectTimestamp = (project: ProjectRecord): number =>
      new Date(project.date).getTime();

    const minTimestamp: any = d3.min(projects, getProjectTimestamp);
    const maxTimestamp: any = d3.max(projects, getProjectTimestamp);
    const timelinePaddingX = 30;
    const timelinePaddingY = 80;
    const [xLeft, xRight] = [timelinePaddingX, width - timelinePaddingX];
    const xScale = d3
      .scaleLinear()
      .domain([minTimestamp, maxTimestamp])
      .range([xLeft, xRight]);

    const projectTypeWeb = "web";
    const projectTypeJar = "jar";
    const projectTypeProgram = "program";

    const uniform = random.uniform(0, 1);
    random.use(seedrandom("foobar"));
    const circles = svg
      .selectAll("circle")
      .data(projects)
      .enter()
      .append("circle")
      .classed("ProjectTimeline-circle", true)
      .attr("cx", (d: ProjectRecord) => {
        return xScale(getProjectTimestamp(d)) || 0;
      })
      .attr("cy", () => {
        let rand = uniform();
        return timelinePaddingY + 40 * (rand * 2 - 1);
      })
      .attr("r", (d) => (d.rating / 10) * 9 + 5)
      .attr("stroke-width", 1.5)
      .attr("fill", (d) => {
        if (d.project_type === projectTypeWeb) {
          return "rgb(200, 88, 70)";
        } else if (d.project_type === projectTypeJar) {
          return "rgb(84, 147, 184)";
        } else if (d.project_type === projectTypeProgram) {
          return "rgb(63, 150, 36)";
        } else {
          return "rgb(255, 255, 255)";
        }
      })
      .attr("id", (d) => `project_${d.project_id}`)
      .on("click", (mouseEvent: any, project: any) => {
        d3.selectAll("circle").attr("stroke", "transparent");
        d3.select(`#project_${project.project_id}`).attr(
          "stroke",
          "rgb(80, 80, 80)"
        );
        this.setState({ currentProject: project });
      });
    circles.append("title").text((d) => d.name);
  };

  componentDidUpdate(prevProps: TimelineProps, prevState: TimelineState) {
    const unarchivedProjects = this.props.projects.filter(
      (project) => !project.archived
    );
    if (prevProps.projects.length === 0) {
      this.populateCanvas(unarchivedProjects);
    }
  }

  createImageElement = (link: string) => {
    return (
      <img
        className="ProjectTimeline-project-image"
        src={link}
        key={link}
        alt="Project screenshot"
      ></img>
    );
  };

  getProjectInfo = (project: ProjectRecord | null) => {
    if (project === null) {
      return;
    }
    const formattedDate = formatDate(project.date);
    const imageElements =
      project.image_links.length === 0 ? (
        <div className="ProjectTimeline-project-item">
          [no images available]
        </div>
      ) : (
        project.image_links.map(this.createImageElement)
      );
    const hasDownloadLink = project.download_link != null;
    const downloadLink =
      project.download_link === null ? "" : project.download_link;
    const downloadElement = hasDownloadLink ? (
      <div className="ProjectTimeline-project-item">
        <span
          className="ProjectTimeline-project-item-link"
          onClick={() => this.props.onProjectDownload(project, downloadLink)}
        >
          Download
        </span>
      </div>
    ) : undefined;
    return (
      <div className="ProjectTimeline-project-info">
        <div className="ProjectTimeline-project-info-text">
          <div className="ProjectTimeline-project-item ProjectTimeline-project-name">
            {project.name}
          </div>
          <div className="ProjectTimeline-project-item">{formattedDate}</div>
          <div className="ProjectTimeline-project-item">
            Language: {project.primary_language}
          </div>
          {downloadElement}
          <div className="ProjectTimeline-project-item ProjectTimeline-project-description">
            {project.description}
          </div>
        </div>
        {imageElements}
      </div>
    );
  };

  render() {
    return (
      <div className="ProjectTimeline">
        <div className="ProjectTimeline-canvas" ref={this.canvasRef}></div>
        {this.getProjectInfo(this.state.currentProject)}
      </div>
    );
  }
}

export default Timeline;
