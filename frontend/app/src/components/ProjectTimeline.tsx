import React from "react";

import * as d3 from "d3";

import { formatDate } from "../controllers/DateTimeUtilities";
import ProjectRecord from "../models/ProjectRecord";
import "./ProjectTimeline.css";

export interface TimelineProps {
  projects: ProjectRecord[];
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
    canvas.selectAll("svg").remove();
    const [width, height] = [1000, 200];
    const svg = canvas
      .append("svg")
      .classed("Timeline-svg", true)
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

    const circles = svg
      .selectAll("circle")
      .data(projects)
      .enter()
      .append("circle")
      .classed("Timeline-circle", true)
      .attr("cx", (d: ProjectRecord) => {
        return xScale(getProjectTimestamp(d)) || 0;
      })
      .attr("cy", () => timelinePaddingY + 40 * (Math.random() * 2 - 1))
      .attr("r", 7)
      .attr("fill", (d) => {
        if (d.project_type == projectTypeWeb) {
          return "rgb(224, 152, 111)";
        } else if (d.project_type == projectTypeJar) {
          return "rgb(113, 173, 208)";
        } else if (d.project_type == projectTypeProgram) {
          return "rgb(113, 173, 208)";
        } else {
          return "rgb(255, 255, 255)";
        }
      })
      .attr("project", (d) => d.project_id)
      .on("click", (mouseEvent, project: any) => {
        this.setState({ currentProject: project });
      });
    circles.append("title").text((d) => d.name);
  };

  componentDidUpdate(prevProps: TimelineProps, prevState: TimelineState) {
    const unarchivedProjects = this.props.projects.filter(
      (project) => !project.archived
    );
    if (prevProps.projects.length == 0) {
      this.populateCanvas(unarchivedProjects);
    }
  }

  getProjectInfo = () => {
    const currentProject = this.state.currentProject as ProjectRecord | null;
    if (currentProject == null) {
      return;
    }
    const formattedDate = formatDate(currentProject.date);
    return (
      <div className="Timeline-project-info">
        <div className="Timeline-project-item">{currentProject.name}</div>
        <div className="Timeline-project-item">{formattedDate}</div>
      </div>
    );
  };

  render() {
    return (
      <div className="Timeline">
        <div className="Timeline-canvas" ref={this.canvasRef}></div>
        {this.getProjectInfo()}
      </div>
    );
  }
}

export default Timeline;
