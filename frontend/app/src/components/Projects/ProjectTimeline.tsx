import React from "react";

import * as d3 from "d3";
import random from "random";
import seedrandom from "seedrandom";

import ProjectModel from "./models/Project";
import "./styles/ProjectTimeline.sass";

class ProjectTypes {
  static GAME = "game";
  static TOOL = "tool";
  static TUTORIAL = "tutorial";
  static VISUALIZATION = "visualization";
}

class Colors {
  static BLACK = "rgb(0, 0, 0)";
  static RED = "rgb(239, 71, 111)";
  static YELLOW = "rgb(255, 209, 102)";
  static GREEN = "rgb(6, 214, 160)";
  static BLUE = "rgb(17, 138, 178)";
  static NAVY = "rgb(7, 59, 76)";

  // static BLACK = "rgb(0, 0, 0)";
  // static BLUE = "rgb(38, 70, 83)";
  // static GREEN = "rgb(42, 157, 143)";
  // static ORANGE = "rgb(244, 162, 97)";
  // static RED = "rgb(231, 111, 81)";
  // static YELLOW = "rgb(233, 196, 106)";

  // static BLACK = "rgb(0, 0, 0)";
  // static RED = "rgb(255, 89, 94)";
  // static YELLOW = "rgb(255, 202, 58)";
  // static GREEN = "rgb(138, 201, 38)";
  // static BLUE = "rgb(25, 130, 196)";
  // static PURPLE = "rgb(106, 76, 147)";
}

class SimConstants {
  static MULT = 130;
  static VELOCITY_LIMIT = 6;
  static STILL_THRESHOLD = 0.01;
}

class GraphicsConstants {
  static WIDTH = 1000;
  static HEIGHT = 240;
  static PADDING_X = 80;
  static PADDING_Y = 80;
}

interface ProjectTimelineProps {
  projects: ProjectModel[];
  currentProject: ProjectModel | null;
  onSelectProject: (project: ProjectModel | null) => void;
}

interface ProjectTimelineState {}

class ProjectTimeline extends React.Component<ProjectTimelineProps, ProjectTimelineState> {
  private GAME_LOOP_SPF = 1.0 / 65.0;
  private canvasRef: React.RefObject<HTMLInputElement>;
  private simRunning = false;

  constructor(props: ProjectTimelineProps) {
    super(props);
    this.canvasRef = React.createRef();
  }

  startSim = (projects: ProjectModel[]) => {
    this.populateCanvas(projects);
    this.simRunning = true;

    let dt = 0;
    let previousTime: number;
    let update = (currentTime: number) => {
      if (previousTime !== undefined) {
        dt += (currentTime - previousTime) / 1000;
        if (dt >= this.GAME_LOOP_SPF) {
          this.updateCanvas(dt, currentTime);
          dt = 0;
        }
      }
      previousTime = currentTime;
      if (!this.simRunning) {
        return;
      }
      window.requestAnimationFrame(update);
    };
    window.requestAnimationFrame(update);
  };

  clip = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, value));
  };

  updateCanvas = (dt: number, currentTime: number) => {
    if (!this.simRunning) {
      return;
    }

    let containers = this.props.projects.map((project) => {
      let selector = this.getProjectSelector(project);
      let circle = d3.select(selector);
      return {
        circle: circle,
        project: project,
        selector: selector,
        force: { x: 0, y: 0 },
      };
    });

    // Compute forces
    containers.forEach((containerA) => {
      containers.forEach((containerB) => {
        if (containerA.selector === containerB.selector) {
          return;
        }

        const [circleA, circleB] = [containerA.circle, containerB.circle];

        const [xA, yA] = [+circleA.attr("cx"), +circleA.attr("cy")];
        const [xB, yB] = [+circleB.attr("cx"), +circleB.attr("cy")];
        const [rA, rB] = [+circleA.attr("r"), +circleB.attr("r")];

        const [dx, dy] = [xB - xA, yB - yA];
        const d = Math.sqrt(dx * dx + dy * dy);
        const dMax = rA + rB + 4;
        if (d < dMax) {
          const sign = yA > yB ? 1 : -1;
          const dDelta = 1 - d / dMax;
          containerA.force.y += sign * dDelta * 5;
        }
      });
    });

    // Apply forces
    containers.forEach((container) => {
      // Clip forces for stability
      let velLim = SimConstants.VELOCITY_LIMIT;
      let fy = this.clip(container.force.y, -velLim, velLim);

      // Update position
      if (Math.abs(fy) <= SimConstants.STILL_THRESHOLD) {
        return;
      }
      let circle = container.circle;
      circle.attr("cy", +circle.attr("cy") + fy);
    });
  };

  getProjectSelector = (project: ProjectModel): string => {
    return `#project_${project.project_id}`;
  };

  getProjectColor = (projectType: string): string => {
    switch (projectType) {
      case ProjectTypes.GAME:
        return Colors.BLUE;
      case ProjectTypes.TOOL:
        return Colors.RED;
      case ProjectTypes.TUTORIAL:
        return Colors.YELLOW;
      case ProjectTypes.VISUALIZATION:
        return Colors.GREEN;
      default:
        return Colors.BLACK;
    }
  };

  populateCanvas = (projects: ProjectModel[]) => {
    const canvas = d3.select(this.canvasRef.current);

    canvas.selectAll("svg").remove();
    const [width, height] = [GraphicsConstants.WIDTH, GraphicsConstants.HEIGHT];
    const svg = canvas
      .append("svg")
      .classed("ProjectTimeline-svg", true)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", `0 0 ${width} ${height}`);

    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "transparent")
      .on("click", (mouseEvent: any) => {
        this.props.onSelectProject(null);
        d3.selectAll("circle").classed("selected", false);
        d3.selectAll("circle").classed("deselected", false);
      });

    const getProjectTimestamp = (project: ProjectModel): number => new Date(project.date).getTime();

    const minTimestamp: any = d3.min(projects, getProjectTimestamp);
    const maxTimestamp: any = d3.max(projects, getProjectTimestamp);
    const xLeft = GraphicsConstants.PADDING_X;
    const xRight = width - GraphicsConstants.PADDING_X;
    const xScale = d3.scaleLinear().domain([minTimestamp, maxTimestamp]).range([xLeft, xRight]);

    const uniform = random.uniform(0, 1);
    random.use(seedrandom("0"));
    const circles = svg
      .selectAll("circle")
      .data(projects)
      .enter()
      .append("circle")
      .classed("ProjectTimeline-circle", true)
      .classed("archived", (d) => d.archived)
      .attr("cx", (project) => {
        return xScale(getProjectTimestamp(project)) || 0;
      })
      .attr("cy", () => {
        let rand = uniform();
        const spread = 10;
        const yCenter = height / 2;
        return yCenter + spread * (rand * 2 - 1);
      })
      .attr("r", (project) => {
        let r = project.rating;
        return (r * r * 6) / 30 + 9;
      })
      .attr("opacity", 1)
      .attr("fill", (project) => this.getProjectColor(project.use_type))
      .attr("fill-opacity", 0)
      .attr("stroke-width", 4)
      .attr("stroke", (project) => this.getProjectColor(project.use_type))
      .attr("id", (project) => `project_${project.project_id}`)
      .on("click", (mouseEvent: any, project: any) => {
        d3.selectAll("circle").classed("deselected", true).classed("selected", false);
        d3.select(this.getProjectSelector(project)).classed("deselected", false).classed("selected", true);
        this.props.onSelectProject(project);
      });
    circles.append("title").text((d) => d.name);
  };

  getLegentElement = () => {};

  getLegend = () => {
    const projectTypes = [ProjectTypes.GAME, ProjectTypes.TOOL, ProjectTypes.TUTORIAL, ProjectTypes.VISUALIZATION];
    return (
      <div className="ProjectTimeline-legend">
        {projectTypes.map((projectType, index) => {
          const projectColor = this.getProjectColor(projectType);
          return (
            <div className="ProjectTimeline-legend-element" key={index}>
              <div className="ProjectTimeline-legend-element-color" style={{ backgroundColor: projectColor }}></div>
              <div className="ProjectTimeline-legend-element-name">{projectType}</div>
            </div>
          );
        })}
      </div>
    );
  };

  componentDidUpdate(prevProps: ProjectTimelineProps, prevState: ProjectTimelineState) {
    if (prevProps.projects.length === 0) {
      this.startSim(this.props.projects);
    }

    const project = this.props.currentProject;
    if (project !== null) {
      d3.selectAll("circle").classed("deselected", true).classed("selected", false);
      d3.select(this.getProjectSelector(project)).classed("deselected", false).classed("selected", true);
    }
  }

  componentWillUnmount() {
    this.simRunning = false;
  }

  render() {
    return (
      <div className="ProjectTimeline">
        {this.getLegend()}
        <div className="ProjectTimeline-canvas" ref={this.canvasRef}></div>
      </div>
    );
  }
}

export default ProjectTimeline;
