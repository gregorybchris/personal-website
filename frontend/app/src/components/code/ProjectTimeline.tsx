import React from "react";

import * as d3 from "d3";
import random from "random";
import seedrandom from "seedrandom";

import ProjectRecord from "../../models/ProjectRecord";
import "./ProjectTimeline.sass";

class ProjectTypes {
  static WEB = "web";
  static JAR = "jar";
  static PROGRAM = "program";
}

class Colors {
  static BLACK = "rgb(0, 0, 0)";
  static BLUE = "rgb(84, 147, 184)";
  static GRAY = "rgb(60, 60, 60)";
  static GREEN = "rgb(63, 150, 36)";
  static RED = "rgb(200, 88, 70)";
}

class SimConstants {
  static MULT = 130;
  static VELOCITY_LIMIT = 6;
  static STILL_THRESHOLD = 0.1;
}

class GraphicsConstants {
  static WIDTH = 1000;
  static HEIGHT = 340;
  static PADDING_X = 50;
  static PADDING_Y = 80;
}

export interface ProjectTimelineProps {
  projects: ProjectRecord[];
  currentProject: ProjectRecord | null;
  onSelectProject: (project: ProjectRecord | null) => void;
}

export interface ProjectTimelineState {}

class ProjectTimeline extends React.Component<
  ProjectTimelineProps,
  ProjectTimelineState
> {
  private GAME_LOOP_SPF = 1.0 / 65.0;
  private canvasRef: React.RefObject<HTMLInputElement>;
  private simRunning = false;

  state = {};

  constructor(props: ProjectTimelineProps) {
    super(props);
    this.canvasRef = React.createRef();
  }

  startSim = (projects: ProjectRecord[]) => {
    this.populateCanvas(projects);
    this.simRunning = true;

    let dt = 0;
    let previousTime: number;
    let update = (currentTime: number) => {
      if (previousTime != undefined) {
        dt += (currentTime - previousTime) / 1000;
        if (dt >= this.GAME_LOOP_SPF) {
          this.updateCanvas(dt);
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

  updateCanvas = (dt: number) => {
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
        if (containerA.selector == containerB.selector) {
          return;
        }

        let [circleA, circleB] = [containerA.circle, containerB.circle];

        let [xA, yA] = [+circleA.attr("cx"), +circleA.attr("cy")];
        let [xB, yB] = [+circleB.attr("cx"), +circleB.attr("cy")];
        let [rA, rB] = [+circleA.attr("r"), +circleB.attr("r")];

        let [dx, dy] = [xB - xA, yB - yA];
        let d = Math.sqrt(dx * dx + dy * dy);
        // let theta = Math.atan2(dy, dx);
        // let fy = Math.sin(theta);

        let rFactor = (rA + rB) / 1.6;
        let sign = yA > yB ? 1 : -1;
        if (Math.abs(d) < 2 + rFactor) {
          containerA.force.y += 1.6 * dt * SimConstants.MULT * sign;
        } else if (Math.abs(d) < 10 + rFactor) {
          containerA.force.y += 0.8 * dt * SimConstants.MULT * sign;
        } else if (Math.abs(d) < 25 + rFactor) {
          containerA.force.y += 0.4 * dt * SimConstants.MULT * sign;
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

  getProjectSelector = (project: ProjectRecord): string => {
    return `#project_${project.project_id}`;
  };

  getProjectColor = (project: ProjectRecord): string => {
    switch (project.project_type) {
      case ProjectTypes.WEB:
        return Colors.RED;
      case ProjectTypes.JAR:
        return Colors.BLUE;
      case ProjectTypes.PROGRAM:
        return Colors.GREEN;
      default:
        return Colors.BLACK;
    }
  };

  populateCanvas = (projects: ProjectRecord[]) => {
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
      .on("mousemove", (mouseEvent: any) => {
        // console.log(mouseEvent);
      })
      .on("click", (mouseEvent: any) => {
        this.props.onSelectProject(null);
        d3.selectAll("circle").classed("selected", false);
        d3.selectAll("circle").classed("deselected", false);
      });

    const getProjectTimestamp = (project: ProjectRecord): number =>
      new Date(project.date).getTime();

    const minTimestamp: any = d3.min(projects, getProjectTimestamp);
    const maxTimestamp: any = d3.max(projects, getProjectTimestamp);
    const xLeft = GraphicsConstants.PADDING_X;
    const xRight = width - GraphicsConstants.PADDING_X;
    const xScale = d3
      .scaleLinear()
      .domain([minTimestamp, maxTimestamp])
      .range([xLeft, xRight]);

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
        return height / 2 + 40 * (rand * 2 - 1);
      })
      .attr("r", (project) => {
        let r = project.rating;
        return (r * r * 6) / 30 + 9;
      })

      .attr("opacity", 1)
      .attr("fill", this.getProjectColor)
      .attr("stroke", this.getProjectColor)
      .attr("id", (project) => `project_${project.project_id}`)
      .on("click", (mouseEvent: any, project: any) => {
        d3.selectAll("circle").classed("deselected", true);
        d3.select(this.getProjectSelector(project)).classed(
          "deselected",
          false
        );
        this.props.onSelectProject(project);
      });
    circles.append("title").text((d) => d.name);
  };

  componentDidUpdate(
    prevProps: ProjectTimelineProps,
    prevState: ProjectTimelineState
  ) {
    if (prevProps.projects.length === 0) {
      this.startSim(this.props.projects);
    }
  }

  componentWillUnmount() {
    this.simRunning = false;
  }

  render() {
    return (
      <div className="ProjectTimeline">
        <div className="ProjectTimeline-canvas" ref={this.canvasRef}></div>
      </div>
    );
  }
}

export default ProjectTimeline;
